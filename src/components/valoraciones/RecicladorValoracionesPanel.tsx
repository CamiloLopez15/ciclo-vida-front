import React from 'react';
import { Star, User, Calendar, MessageSquare, ArrowLeft } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { mockValoraciones, mockCiudadanos } from '../../data/mockData';

interface RecicladorValoracionesPanelProps {
  onBack: () => void;
}

export const RecicladorValoracionesPanel: React.FC<RecicladorValoracionesPanelProps> = ({
  onBack
}) => {
  const { user } = useAuth();

  // Filtrar valoraciones para el reciclador actual
  const misValoraciones = mockValoraciones.filter(v => v.recicladorId === user?.id);

  // Calcular estadísticas
  const promedioRating = misValoraciones.length > 0 
    ? (misValoraciones.reduce((acc, v) => acc + v.rating, 0) / misValoraciones.length).toFixed(1)
    : '0.0';

  const distribucionRatings = {
    5: misValoraciones.filter(v => v.rating === 5).length,
    4: misValoraciones.filter(v => v.rating === 4).length,
    3: misValoraciones.filter(v => v.rating === 3).length,
    2: misValoraciones.filter(v => v.rating === 2).length,
    1: misValoraciones.filter(v => v.rating === 1).length,
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
            <p className="text-2xl font-bold text-gray-900">{promedioRating}</p>
            <p className="text-sm text-gray-600">Promedio General</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{misValoraciones.length}</p>
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
              {new Set(misValoraciones.map(v => v.ciudadanoId)).size}
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
                    width: misValoraciones.length > 0 
                      ? `${(distribucionRatings[stars as keyof typeof distribucionRatings] / misValoraciones.length) * 100}%`
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
        
        {misValoraciones.length === 0 ? (
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
            {misValoraciones
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((valoracion) => {
                const ciudadano = mockCiudadanos.find(c => c.id === valoracion.ciudadanoId);
                
                return (
                  <Card key={valoracion.id}>
                    <div className="space-y-4">
                      {/* Header con info del ciudadano */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          {ciudadano?.avatar ? (
                            <img
                              src={ciudadano.avatar}
                              alt={ciudadano.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-600" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {ciudadano?.name || 'Cliente'}
                            </h3>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(valoracion.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Badge 
                          variant={
                            valoracion.rating >= 5 ? 'success' :
                            valoracion.rating >= 4 ? 'info' :
                            valoracion.rating >= 3 ? 'warning' : 'error'
                          }
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
      </div>
    </div>
  );
};