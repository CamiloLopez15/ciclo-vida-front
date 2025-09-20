import React, { useState } from 'react';
import { Calendar, MapPin, Recycle, Star, Plus, Users } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { ValoracionModal } from '../../valoraciones/ValoracionModal';
import { NotificacionesPanel } from '../../notificaciones/NotificacionesPanel';
import { AgendarRecoleccionModal } from '../../recolecciones/AgendarRecoleccionModal';
import { RecoleccionCard } from '../../recolecciones/RecoleccionCard';
import { RecicladorCard } from '../../recicladores/RecicladorCard';
import { EditProfileModal } from '../../profile/EditProfileModal';
import { MapView } from '../../maps/MapView';
import { useAuth } from '../../../context/AuthContext';
import { mockRecolecciones, mockRecicladores, mockNotificaciones } from '../../../data/mockData';
import { Notificacion, Recoleccion } from '../../../types';

export const CiudadanoDashboard: React.FC = () => {
  const { user } = useAuth();
  const [showAgendarModal, setShowAgendarModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showValoracionModal, setShowValoracionModal] = useState(false);
  const [selectedRecoleccion, setSelectedRecoleccion] = useState<Recoleccion | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'recolecciones' | 'recicladores' | 'mapa' | 'notificaciones'>('dashboard');
  const [recolecciones, setRecolecciones] = useState(mockRecolecciones.filter(r => r.ciudadanoId === user?.id));
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>(
    mockNotificaciones.filter(n => n.userId === user?.id)
  );

  const handleAgendarRecoleccion = (data: any) => {
    const nuevaRecoleccion = {
      ...data,
      ciudadanoId: user?.id || '1',
      coordinates: { lat: 4.6533, lng: -74.0836 }
    };
    setRecolecciones(prev => [nuevaRecoleccion, ...prev]);
  };

  const handleRecoleccionAction = (action: string, recoleccion: any) => {
    if (action === 'valorar') {
      // Buscar el reciclador asociado a la recolección
      const reciclador = mockRecicladores.find(r => r.id === recoleccion.recicladorId);

      if (reciclador) {
        setSelectedRecoleccion(recoleccion);
        setShowValoracionModal(true);
      } else {
        console.error('No se encontró el reciclador para esta recolección');
      }
    }
  };

  const handleValoracionSubmit = () => {
    // Aquí se enviaría la valoración a la API
  };

  const handleNotificationAction = (action: 'markAsRead' | 'delete' | 'markAllAsRead', id?: string) => {
    if (action === 'markAsRead' && id) {
      setNotificaciones(prev =>
        prev.map(n => n.id === id ? { ...n, leida: true } : n)
      );
    } else if (action === 'delete' && id) {
      setNotificaciones(prev => prev.filter(n => n.id !== id));
    } else if (action === 'markAllAsRead') {
      setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
    }
  };

  const stats = {
    totalRecolecciones: recolecciones.length,
    proximaRecoleccion: recolecciones.find(r => r.estado === 'pendiente' || r.estado === 'aceptada'),
    kgReciclados: 45.2
  };

  function renderMainContent() {
    // Mover todo el contenido existente aquí
    if (activeTab === 'recolecciones') {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Recolecciones</h1>
              <p className="text-gray-600 mt-2">Gestionasss tus solicitudes de recolección</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setActiveTab('dashboard')}>
                Volver al Dashboard
              </Button>
              <Button onClick={() => setShowAgendarModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Recolección
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recolecciones.map((recoleccion) => (
              <RecoleccionCard
                key={recoleccion.id}
                recoleccion={recoleccion}
                userType="ciudadano"
                onAction={handleRecoleccionAction}
              />
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'recicladores') {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Recicladores Cercanos</h1>
              <p className="text-gray-600 mt-2">Encuentra recicladores en tu área</p>
            </div>
            <Button variant="outline" onClick={() => setActiveTab('dashboard')}>
              Volver al Dashboard
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockRecicladores.map((reciclador) => (
              <RecicladorCard
                key={reciclador.id}
                reciclador={reciclador}
                onContact={(r) => console.log('Contactar:', r)}
                onViewProfile={(r) => console.log('Ver perfil:', r)}
              />
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'notificaciones') {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Centro de Notificaciones</h1>
              <p className="text-gray-600 mt-2">Mantente al día con tus recolecciones</p>
            </div>
            <Button variant="outline" onClick={() => setActiveTab('dashboard')}>
              Volver al Dashboard
            </Button>
          </div>

          <NotificacionesPanel
            notificaciones={notificaciones}
            onMarkAsRead={(id) => handleNotificationAction('markAsRead', id)}
            onMarkAllAsRead={() => handleNotificationAction('markAllAsRead')}
            onDelete={(id) => handleNotificationAction('delete', id)}
          />
        </div>
      );
    }

    if (activeTab === 'mapa') {
      const mapMarkers = [
        // Marcador del usuario actual
        {
          id: 'user',
          position: { lat: 4.6533, lng: -74.0836 }, // Coordenadas de ejemplo (Bogotá)
          title: 'Tu ubicación',
          type: 'user' as const
        },
        // Marcadores de recicladores cercanos (ejemplo)
        ...mockRecicladores.slice(0, 5).map((reciclador) => ({
          id: `reciclador-${reciclador.id}`,
          position: { 
            lat: 4.6533 + (Math.random() * 0.02 - 0.01), // Coordenadas cercanas al usuario
            lng: -74.0836 + (Math.random() * 0.02 - 0.01)
          },
          title: reciclador.name,
          type: 'reciclador' as const
        }))
      ];

      return (
        <div className="space-y-4 px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mapa de Recicladores</h1>
              <p className="text-gray-600 mt-1">Encuentra recicladores cerca de tu ubicación</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button 
                variant="outline" 
                className="w-full md:w-auto"
                onClick={() => setActiveTab('recicladores')}
              >
                <Users className="w-4 h-4 mr-2" />
                Ver Lista
              </Button>
              <Button 
                variant="outline" 
                className="w-full md:w-auto"
                onClick={() => setActiveTab('dashboard')}
              >
                Volver al Inicio
              </Button>
            </div>
          </div>
          
          <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200" style={{ height: 'calc(100vh - 200px)' }}>
            <MapView height="100%" />
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-medium text-gray-800 mb-3">Leyenda del Mapa</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">Tu ubicación</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">Recicladores disponibles</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Vista principal del dashboard
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mi Dashboard</h1>
          <p className="text-gray-600 mt-2">Gestiona tus recolecciones de reciclaje</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Recycle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Recolecciones</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRecolecciones}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Próxima Recolección</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.proximaRecoleccion
                    ? new Date(stats.proximaRecoleccion.fecha).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Kg Reciclados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.kgReciclados}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
            <div className="space-y-3">
              <Button className="w-full justify-start" onClick={() => setShowAgendarModal(true)}>
                <Calendar className="w-4 h-4 mr-2" />
                Agendar Nueva Recolección
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('recicladores')}>
                <Users className="w-4 h-4 mr-2" />
                Ver Recicladores Cercanos
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('mapa')}>
                <MapPin className="w-4 h-4 mr-2" />
                Ver Mapa
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('recolecciones')}>
                <Recycle className="w-4 h-4 mr-2" />
                Mis Recolecciones
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('notificaciones')}>
                <Star className="w-4 h-4 mr-2" />
                Notificaciones
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setShowProfileModal(true)}>
                <Star className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recolecciones Recientes</h2>
            <div className="space-y-4">
              {recolecciones.slice(0, 3).map((recoleccion) => (
                <div key={recoleccion.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {recoleccion.recicladorId
                        ? mockRecicladores.find(r => r.id === recoleccion.recicladorId)?.name || 'Reciclador'
                        : 'Pendiente de asignación'
                      }
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(recoleccion.fecha).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}, {recoleccion.hora}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${recoleccion.estado === 'completada' ? 'bg-green-100 text-green-800' :
                    recoleccion.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                      recoleccion.estado === 'aceptada' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {recoleccion.estado === 'completada' ? 'Completada' :
                      recoleccion.estado === 'pendiente' ? 'Pendiente' :
                        recoleccion.estado === 'aceptada' ? 'Aceptada' :
                          recoleccion.estado}
                  </span>
                </div>
              ))}
              {recolecciones.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Recycle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No tienes recolecciones aún</p>
                  <Button
                    className="mt-4"
                    size="sm"
                    onClick={() => setShowAgendarModal(true)}
                  >
                    Agendar Primera Recolección
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Renderizar modales globalmente (fuera de las vistas condicionales)
  const renderModals = () => (
    <>
      {/* Modal de agendar recolección */}
      <AgendarRecoleccionModal
        isOpen={showAgendarModal}
        onClose={() => setShowAgendarModal(false)}
        onSubmit={handleAgendarRecoleccion}
      />

      {/* Modal de perfil */}
      <EditProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      {/* Modal de valoración */}
      {selectedRecoleccion && (
        (() => {
          const reciclador = mockRecicladores.find(r => r.id === selectedRecoleccion.recicladorId);
          return reciclador ? (
            <ValoracionModal
              isOpen={showValoracionModal}
              onClose={() => {
                setShowValoracionModal(false);
                setSelectedRecoleccion(null);
              }}
              recoleccion={selectedRecoleccion}
              reciclador={reciclador}
              onSuccess={() => handleValoracionSubmit()}
            />
          ) : null;
        })()
      )}
    </>
  );

  // Renderizar la vista principal con modales globales
  return (
    <>
      {/* Contenido principal */}
      {renderMainContent()}

      {/* Modales globales */}
      {renderModals()}
    </>
  );
};