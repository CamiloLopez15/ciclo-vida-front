import React, { useState, useEffect, useCallback } from 'react';
import { Star, User, Calendar, MessageSquare, ArrowLeft, Loader, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { ReviewService } from '../../services/ReviewService';
import { Review, ReviewStats } from '../../types/review.types';

interface RecicladorValoracionesPanelProps {
  onBack: () => void;
}

export const RecicladorValoracionesPanel: React.FC<RecicladorValoracionesPanelProps> = ({
  onBack
}) => {
  const { user } = useAuth();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<string | undefined>(undefined);

  const fetchReviews = useCallback(async (recyclerId: string, startAfterDoc?: string) => {
    if (startAfterDoc) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await ReviewService.getReviews(recyclerId, { 
        limit: 6, 
        startAfter: startAfterDoc 
      });
      
      setReviews(prev => startAfterDoc ? [...prev, ...response.reviews] : response.reviews);
      if (!startAfterDoc) {
        setStats(response.stats);
      }
      setHasMore(response.hasMore);
      setLastDoc(response.lastDoc);

    } catch (err) {
      setError("No se pudieron cargar las valoraciones.");
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchReviews(user.id);
    }
  }, [user, fetchReviews]);

  // Calcular distribución de ratings a partir de los datos del estado
  const distribucionRatings = React.useMemo(() => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating as keyof typeof distribution]++;
      }
    });
    return distribution;
  }, [reviews]);

  const handleLoadMore = () => {
    if (user?.id && hasMore && !isLoadingMore) {
      fetchReviews(user.id, lastDoc);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader className="w-12 h-12 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Ocurrió un error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Valoraciones</h1>
          <p className="text-gray-600 mt-2">Revisa el feedback de tus clientes</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Dashboard
        </Button>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.averageRating.toFixed(1) || '0.0'}</p>
            <p className="text-sm text-gray-600">Promedio General</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.totalReviews || 0}</p>
            <p className="text-sm text-gray-600">Total Valoraciones</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-green-600 fill-current" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{distribucionRatings[5]}</p>
            <p className="text-sm text-gray-600">5 Estrellas</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {/* Nota: La API no provee clientes únicos, este cálculo es una aproximación desde los datos cargados */}
              {new Set(reviews.map(v => v.usuarioId)).size}
            </p>
            <p className="text-sm text-gray-600">Clientes Únicos</p>
          </div>
        </Card>
      </div>

      {/* Distribución de Calificaciones */}
      <Card className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Distribución de Calificaciones</h2>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 w-20">
                <span className="text-sm font-medium text-gray-700">{stars}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: stats && stats.totalReviews > 0 
                      ? `${(distribucionRatings[stars as keyof typeof distribucionRatings] / stats.totalReviews) * 100}%`
                      : '0%'
                  }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8">
                {distribucionRatings[stars as keyof typeof distribucionRatings]}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Lista de Valoraciones */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Valoraciones Recientes</h2>
        
        {reviews.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aún no tienes valoraciones
              </h3>
              <p className="text-gray-600">
                Completa más recolecciones para recibir feedback de tus clientes
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reviews
              .map((valoracion) => {
                // La API no devuelve los datos del ciudadano, así que los mostramos anónimamente
                return (
                  <Card key={valoracion.id}>
                    <div className="space-y-4">
                      {/* Header con info del ciudadano */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              Cliente Anónimo
                            </h3>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(valoracion.fecha)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Badge 
                          variant={{
                            5: 'success',
                            4: 'info',
                            3: 'warning',
                            2: 'error',
                            1: 'error'
                          }[valoracion.rating] as any}
                        >
                          {valoracion.rating} ⭐
                        </Badge>
                      </div>

                      {/* Calificación con estrellas */}
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          {renderStars(valoracion.rating)}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({valoracion.rating}/5)
                        </span>
                      </div>

                      {/* Comentario */}
                      {valoracion.comentario && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-gray-700 text-sm leading-relaxed">
                            "{valoracion.comentario}"
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
          </div>
        )}
        {hasMore && (
          <div className="text-center mt-8">
            <Button onClick={handleLoadMore} isLoading={isLoadingMore}>
              Cargar más valoraciones
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};