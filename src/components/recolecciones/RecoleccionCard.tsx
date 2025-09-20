import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Package } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Recoleccion } from '../../types';
import { AppointmentCompletionModal } from './AppointmentCompletionModal';

interface RecoleccionCardProps {
  recoleccion: Recoleccion;
  userType: 'ciudadano' | 'reciclador';
  onAction?: (action: string, recoleccion: Recoleccion) => void;
}

const estadoColors = {
  pendiente: 'warning',
  aceptada: 'info',
  en_progreso: 'info',
  completada: 'success',
  cancelada: 'error'
} as const;

const estadoLabels = {
  pendiente: 'Pendiente',
  aceptada: 'Aceptada',
  en_progreso: 'En Progreso',
  completada: 'Completada',
  cancelada: 'Cancelada'
};

export const RecoleccionCard: React.FC<RecoleccionCardProps> = ({
  recoleccion,
  userType,
  onAction
}) => {
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant={estadoColors[recoleccion.estado]}>
              {estadoLabels[recoleccion.estado]}
            </Badge>
            <span className="text-sm text-gray-500">#{recoleccion.id}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDate(recoleccion.fecha)}
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              {formatTime(recoleccion.hora)}
            </div>
            
            <div className="flex items-start text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>{recoleccion.direccion}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <Package className="w-4 h-4 mr-2" />
          <span>Materiales:</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {recoleccion.tipoMaterial.map((material) => (
            <Badge key={material} variant="default" size="sm">
              {material}
            </Badge>
          ))}
        </div>
      </div>

      {recoleccion.descripcion && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">{recoleccion.descripcion}</p>
        </div>
      )}

      {/* Acciones según el tipo de usuario y estado */}
      <div className="flex space-x-2 pt-4 border-t">
        {userType === 'reciclador' && recoleccion.estado === 'pendiente' && (
          <>
            <Button 
              size="sm" 
              onClick={() => setShowCompletionModal(true)}
            >
              Aceptar
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onAction?.('ver_detalles', recoleccion)}
            >
              Ver Detalles
            </Button>
          </>
        )}
        
        {userType === 'reciclador' && recoleccion.estado === 'aceptada' && (
          <>
            <Button 
              size="sm"
              onClick={() => onAction?.('iniciar', recoleccion)}
            >
              Iniciar Recolección
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onAction?.('contactar', recoleccion)}
            >
              Contactar
            </Button>
          </>
        )}
        
        {userType === 'reciclador' && recoleccion.estado === 'en_progreso' && (
          <Button 
            size="sm"
            onClick={() => onAction?.('completar', recoleccion)}
          >
            Completar
          </Button>
        )}
        
        {userType === 'ciudadano' && recoleccion.estado === 'pendiente' && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onAction?.('cancelar', recoleccion)}
          >
            Cancelar
          </Button>
        )}
        
        {userType === 'ciudadano' && recoleccion.estado === 'completada' && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onAction?.('valorar', recoleccion)}
          >
            Valorar
          </Button>
        )}
      </div>
      {/* Modal de Finalización desde la tarjeta */}
      {userType === 'reciclador' && showCompletionModal && (
        <AppointmentCompletionModal
          isOpen={showCompletionModal}
          onClose={() => setShowCompletionModal(false)}
          appointmentId={recoleccion.id}
          onSuccess={() => {
            // Notificar al padre que la recolección fue completada
            onAction?.('completar', { ...recoleccion, estado: 'completada' });
            setShowCompletionModal(false);
          }}
        />
      )}
    </Card>
  );
};