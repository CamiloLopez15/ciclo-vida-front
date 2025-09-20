import React, { useState } from 'react';
import { Bell, Check, X, Clock, Star, Recycle, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Notificacion } from '../../types';

interface NotificacionesPanelProps {
  notificaciones: Notificacion[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
}

const iconMap = {
  recoleccion_aceptada: Recycle,
  recoleccion_completada: Check,
  nueva_valoracion: Star,
  recordatorio: Clock,
  sistema: AlertCircle
};

const colorMap = {
  recoleccion_aceptada: 'text-green-600',
  recoleccion_completada: 'text-blue-600',
  nueva_valoracion: 'text-yellow-600',
  recordatorio: 'text-orange-600',
  sistema: 'text-purple-600'
};

export const NotificacionesPanel: React.FC<NotificacionesPanelProps> = ({
  notificaciones,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotificaciones = notificaciones.filter(notif => 
    filter === 'all' || !notif.leida
  );

  const unreadCount = notificaciones.filter(n => !n.leida).length;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace unos minutos';
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    if (diffInHours < 48) return 'Ayer';
    return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Notificaciones</h2>
          {unreadCount > 0 && (
            <Badge variant="error" size="sm">
              {unreadCount}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter === 'unread'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              No leídas
            </button>
          </div>
          
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>
              Marcar todas como leídas
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {filteredNotificaciones.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>
              {filter === 'unread' 
                ? 'No tienes notificaciones sin leer' 
                : 'No tienes notificaciones'
              }
            </p>
          </div>
        ) : (
          filteredNotificaciones.map((notificacion) => {
            const IconComponent = iconMap[notificacion.tipo];
            const iconColor = colorMap[notificacion.tipo];
            
            return (
              <div
                key={notificacion.id}
                className={`p-4 rounded-lg border transition-colors ${
                  notificacion.leida
                    ? 'bg-white border-gray-200'
                    : 'bg-green-50 border-green-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-white ${iconColor}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`text-sm font-medium ${
                          notificacion.leida ? 'text-gray-900' : 'text-gray-900'
                        }`}>
                          {notificacion.titulo}
                        </h3>
                        <p className={`text-sm mt-1 ${
                          notificacion.leida ? 'text-gray-600' : 'text-gray-700'
                        }`}>
                          {notificacion.mensaje}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatTime(notificacion.createdAt)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-4">
                        {!notificacion.leida && (
                          <button
                            onClick={() => onMarkAsRead(notificacion.id)}
                            className="p-1 text-gray-400 hover:text-green-600 rounded"
                            title="Marcar como leída"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onDelete(notificacion.id)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded"
                          title="Eliminar notificación"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};