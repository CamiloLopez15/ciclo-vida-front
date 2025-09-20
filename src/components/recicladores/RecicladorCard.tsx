import React from 'react';
import { Star, MapPin, Clock, Phone, User } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Reciclador } from '../../types';

interface RecicladorCardProps {
  reciclador: Reciclador;
  onContact?: (reciclador: Reciclador) => void;
  onViewProfile?: (reciclador: Reciclador) => void;
}

export const RecicladorCard: React.FC<RecicladorCardProps> = ({
  reciclador,
  onContact,
  onViewProfile
}) => {
  return (
    <Card>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {reciclador.avatar ? (
            <img
              src={reciclador.avatar}
              alt={reciclador.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-green-600" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {reciclador.name}
            </h3>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700">
                {reciclador.rating}
              </span>
              <span className="text-sm text-gray-500">
                ({reciclador.totalRecolecciones})
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {reciclador.description}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              {reciclador.workingHours.start} - {reciclador.workingHours.end}
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-2" />
              {reciclador.phone}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Áreas de cobertura:</p>
            <div className="flex flex-wrap gap-1">
              {reciclador.coverageAreas.map((area) => (
                <Badge key={area} variant="default" size="sm">
                  {area}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button 
              size="sm"
              onClick={() => onContact?.(reciclador)}
            >
              Contactar
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewProfile?.(reciclador)}
            >
              Ver Perfil
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};