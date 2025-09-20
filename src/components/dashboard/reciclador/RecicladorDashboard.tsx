import React, { useState } from 'react';
import { Calendar, MapPin, Star, TrendingUp, Clock, CheckCircle, Settings } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { NotificacionesPanel } from '../../notificaciones/NotificacionesPanel';
import { RecoleccionCard } from '../../recolecciones/RecoleccionCard';
import { EditProfileModal } from '../../profile/EditProfileModal';
import { MapView } from '../../maps/MapView';
import { useAuth } from '../../../context/AuthContext';
import { mockRecolecciones, mockCiudadanos, mockNotificaciones } from '../../../data/mockData';
import { Notificacion } from '../../../types';
export const RecicladorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'recolecciones' | 'mapa' | 'notificaciones'>('dashboard');
  const [recolecciones, setRecolecciones] = useState(mockRecolecciones);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>(
    mockNotificaciones.filter(n => n.userId === user?.id)
  );

  const handleRecoleccionAction = (action: string, recoleccion: any) => {
    if (action === 'aceptar') {
      setRecolecciones(prev => 
        prev.map(r => 
          r.id === recoleccion.id 
            ? { ...r, estado: 'aceptada' as const, recicladorId: user?.id }
            : r
        )
      );
    } else if (action === 'iniciar') {
      setRecolecciones(prev => 
        prev.map(r => 
          r.id === recoleccion.id 
            ? { ...r, estado: 'en_progreso' as const }
            : r
        )
      );
    } else if (action === 'completar') {
      setRecolecciones(prev => 
        prev.map(r => 
          r.id === recoleccion.id 
            ? { ...r, estado: 'completada' as const }
            : r
        )
      );
    }
    console.log('Acción:', action, recoleccion);
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

  const recoleccionesPendientes = recolecciones.filter(r => r.estado === 'pendiente');
  const recoleccionesAceptadas = recolecciones.filter(r => r.recicladorId === user?.id);
  const recoleccionesCompletadas = recoleccionesAceptadas.filter(r => r.estado === 'completada');

  const stats = {
    completadas: recoleccionesCompletadas.length,
    pendientes: recoleccionesPendientes.length,
    rating: 4.8,
    esteMes: recoleccionesCompletadas.filter(r => 
      new Date(r.createdAt).getMonth() === new Date().getMonth()
    ).length
  };

  if (activeTab === 'recolecciones') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Recolecciones</h1>
            <p className="text-gray-600 mt-2">Administra tus solicitudes de recolección</p>
          </div>
          <Button variant="outline" onClick={() => setActiveTab('dashboard')}>
            Volver al Dashboard
          </Button>
        </div>

        <div className="space-y-8">
          {/* Recolecciones Pendientes */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recolecciones Pendientes ({recoleccionesPendientes.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recoleccionesPendientes.map((recoleccion) => (
                <RecoleccionCard
                  key={recoleccion.id}
                  recoleccion={recoleccion}
                  userType="reciclador"
                  onAction={handleRecoleccionAction}
                />
              ))}
            </div>
          </div>

          {/* Mis Recolecciones */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Mis Recolecciones ({recoleccionesAceptadas.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recoleccionesAceptadas.map((recoleccion) => (
                <RecoleccionCard
                  key={recoleccion.id}
                  recoleccion={recoleccion}
                  userType="reciclador"
                  onAction={handleRecoleccionAction}
                />
              ))}
            </div>
          </div>
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
            <p className="text-gray-600 mt-2">Mantente informado sobre nuevas oportunidades</p>
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
      {
        id: 'reciclador',
        position: { lat: 4.6482, lng: -74.0776 },
        title: 'Mi ubicación',
        type: 'reciclador' as const
      },
      ...recoleccionesPendientes.map(r => ({
        id: r.id,
        position: r.coordinates,
        title: `Recolección ${r.id}`,
        type: 'user' as const
      }))
    ];

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mapa de Recolecciones</h1>
            <p className="text-gray-600 mt-2">Visualiza las recolecciones pendientes en tu área</p>
          </div>
          <Button variant="outline" onClick={() => setActiveTab('dashboard')}>
            Volver al Dashboard
          </Button>
        </div>

        <MapView
          center={{ lat: 4.6482, lng: -74.0776 }}
          markers={mapMarkers}
          height="500px"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Reciclador</h1>
        <p className="text-gray-600 mt-2">Gestiona tus recolecciones y rutas</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completadas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completadas}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendientes}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Calificación</p>
              <p className="text-2xl font-bold text-gray-900">{stats.rating}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Este Mes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.esteMes}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recolecciones Pendientes</h2>
          <div className="space-y-4">
            {recoleccionesPendientes.slice(0, 2).map((recoleccion) => {
              const ciudadano = mockCiudadanos.find(c => c.id === recoleccion.ciudadanoId);
              return (
                <div key={recoleccion.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{ciudadano?.name || 'Ciudadano'}</h3>
                      <p className="text-sm text-gray-600 mt-1">{recoleccion.direccion}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(recoleccion.fecha).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}, {recoleccion.hora}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {recoleccion.tipoMaterial.map((material) => (
                          <span key={material} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {material}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button size="sm" onClick={() => handleRecoleccionAction('aceptar', recoleccion)}>
                        Aceptar
                      </Button>
                      <Button variant="outline" size="sm">Ver Detalles</Button>
                    </div>
                  </div>
                </div>
              );
            })}
            {recoleccionesPendientes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No hay recolecciones pendientes</p>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="space-y-3">
            <Button className="w-full justify-start" onClick={() => setActiveTab('mapa')}>
              <MapPin className="w-4 h-4 mr-2" />
              Ver Mapa de Recolecciones
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('recolecciones')}>
              <Calendar className="w-4 h-4 mr-2" />
              Gestionar Recolecciones
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => setShowProfileModal(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Configurar Perfil
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('notificaciones')}>
              <Star className="w-4 h-4 mr-2" />
              Notificaciones
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Star className="w-4 h-4 mr-2" />
              Mis Valoraciones
            </Button>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-green-900 mb-2">Tip del día</h3>
            <p className="text-sm text-green-700">
              Mantén una comunicación clara con los ciudadanos para mejorar tu calificación.
            </p>
          </div>
        </Card>
      </div>

      {/* Modal de perfil */}
      <EditProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
};