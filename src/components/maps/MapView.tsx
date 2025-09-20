import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Card } from '../ui/Card';

interface MapViewProps {
  center?: { lat: number; lng: number };
  markers?: Array<{
    id: string;
    position: { lat: number; lng: number };
    title: string;
    type: 'user' | 'reciclador';
  }>;
  height?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  center = { lat: 4.6533, lng: -74.0836 },
  markers = [],
  height = '400px'
}) => {
  return (
    <Card padding="none" className="overflow-hidden">
      <div 
        className="relative bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center"
        style={{ height }}
      >
        {/* Simulación de mapa */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-green-200 relative">
            {/* Líneas de cuadrícula simulando calles */}
            <div className="absolute inset-0">
              {[...Array(8)].map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute w-full h-px bg-green-300"
                  style={{ top: `${(i + 1) * 12.5}%` }}
                />
              ))}
              {[...Array(8)].map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute h-full w-px bg-green-300"
                  style={{ left: `${(i + 1) * 12.5}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Marcadores */}
        {markers.map((marker) => (
          <div
            key={marker.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${50 + (marker.position.lng - center.lng) * 1000}%`,
              top: `${50 - (marker.position.lat - center.lat) * 1000}%`
            }}
          >
            <div className={`p-2 rounded-full shadow-lg ${
              marker.type === 'user' ? 'bg-blue-500' : 'bg-green-500'
            }`}>
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
              <div className="bg-white px-2 py-1 rounded shadow text-xs font-medium whitespace-nowrap">
                {marker.title}
              </div>
            </div>
          </div>
        ))}

        {/* Centro del mapa */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Navigation className="w-6 h-6 text-green-600" />
        </div>

        {/* Overlay de información */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-900">Vista de Mapa</p>
          <p className="text-xs text-gray-600">Simulación - Google Maps API</p>
        </div>
      </div>
    </Card>
  );
};