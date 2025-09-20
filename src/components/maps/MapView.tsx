import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Card } from '../ui/Card';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { mockRecicladores } from '../../data/mockData';

// Estilos del mapa
const containerStyle = {
  width: '100%',
  height: '600px',
  minHeight: '500px'
};

// Coordenadas por defecto (Bogotá)
const defaultCenter = {
  lat: 4.6533,
  lng: -74.0836
};

// Función para calcular distancia entre dos coordenadas (fórmula del semiverseno)
const calcularDistancia = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon/2) *
    Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distancia en km
};

export const MapView: React.FC<{ height?: string }> = ({ height = '600px' }) => {
  const [center, setCenter] = useState(defaultCenter);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [nearestRecyclers, setNearestRecyclers] = useState<Array<{
    id: string;
    position: { lat: number; lng: number };
    title: string;
    distance: number;
    rating?: number;
    name: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar la API de Google Maps
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  });

  // Función para abrir la ubicación en la aplicación de mapas nativa
  const abrirEnMaps = (reciclador: any) => {
    const { lat, lng } = reciclador.position;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    
    // Abrir en nueva ventana/tabla
    window.open(url, '_blank');
  };

  // Función para mostrar detalles del reciclador
  const mostrarDetallesReciclador = (reciclador: any) => {
    // Aquí podrías abrir un modal con más detalles del reciclador
    console.log('Detalles del reciclador:', reciclador);
    alert(`
${reciclador.name}
📍 Ubicación: ${reciclador.position.lat}, ${reciclador.position.lng}
📏 Distancia: ${reciclador.distance} km
⭐ Calificación: ${reciclador.rating || 'N/A'}

${reciclador.description || ''}

📞 ${reciclador.phone || 'Sin teléfono'}
⏰ ${reciclador.workingHours ? `${reciclador.workingHours.start} - ${reciclador.workingHours.end}` : 'Horario no especificado'}
`);
  };

  // Procesar recicladores cercanos
  const procesarRecicladoresCercanos = useCallback((userPos: {lat: number, lng: number}) => {
    try {
      console.log('Procesando recicladores cercanos...');
      const recicladoresConDistancia = mockRecicladores
        .map(reciclador => {
          const distancia = calcularDistancia(
            userPos.lat,
            userPos.lng,
            reciclador.coordinates.lat,
            reciclador.coordinates.lng
          );
          return {
            ...reciclador,
            distance: distancia,
            position: reciclador.coordinates,
            title: `${reciclador.name} - ${distancia.toFixed(1)} km`,
            name: reciclador.name
          };
        })
        .sort((a, b) => a.distance - b.distance) // Ordenar por distancia
        .slice(0, 10); // Tomar los 10 más cercanos

      console.log('Recicladores procesados:', recicladoresConDistancia);
      setNearestRecyclers(recicladoresConDistancia);
    } catch (err) {
      console.error('Error procesando recicladores:', err);
      setError('Error al cargar los recicladores cercanos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener ubicación del usuario
  const obtenerUbicacion = useCallback(() => {
    setLoading(true);
    console.log('Obteniendo ubicación del usuario...');

    if (!navigator.geolocation) {
      console.log('Geolocalización no soportada');
      setError('Tu navegador no soporta geolocalización');
      procesarRecicladoresCercanos(defaultCenter);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Ubicación obtenida:', position);
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCenter(pos);
        procesarRecicladoresCercanos(pos);

        if (mapRef.current) {
          mapRef.current.panTo(pos);
          mapRef.current.setZoom(14);
        }
      },
      (error) => {
        console.error('Error de geolocalización:', error);
        setError('No se pudo obtener tu ubicación. Usando ubicación por defecto.');
        procesarRecicladoresCercanos(defaultCenter);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  }, [procesarRecicladoresCercanos]);

  // Manejar errores de carga de Google Maps
  useEffect(() => {
    if (loadError) {
      console.error('Error cargando Google Maps:', loadError);
      setError('Error al cargar el mapa. Por favor, recarga la página.');
    }
  }, [loadError]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    if (isLoaded) {
      console.log('API de Google Maps cargada');
      obtenerUbicacion();
    }
  }, [isLoaded, obtenerUbicacion]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">
            {loading ? 'Buscando recicladores cercanos...' : 'Cargando mapa...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" style={{ height, width: '100%' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        onLoad={(map) => {
          mapRef.current = map;
          console.log('Mapa cargado');
        }}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          zoomControl: false,
        }}
      >
        {/* Marcador del usuario */}
        <Marker
          position={center}
          title="Tu ubicación"
          icon={{
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new window.google.maps.Size(40, 40)
          }}
        />

        {/* Marcadores de recicladores */}
        {nearestRecyclers.map((reciclador) => (
          <Marker
            key={reciclador.id}
            position={reciclador.position}
            title={`${reciclador.name} - ${reciclador.distance.toFixed(1)} km`}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
              scaledSize: new window.google.maps.Size(40, 40)
            }}
            label={{
              text: `${reciclador.distance.toFixed(1)} km`,
              color: '#166534',
              fontWeight: 'bold',
              fontSize: '12px',
              className: 'map-marker-label'
            }}
            onClick={() => mostrarDetallesReciclador(reciclador)}
          />
        ))}
      </GoogleMap>

      {/* Controles del mapa */}
      <div className="absolute top-4 right-4 flex flex-col gap-3">
        <button
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                  };
                  setCenter(pos);
                  if (mapRef.current) {
                    mapRef.current.panTo(pos);
                    mapRef.current.setZoom(14);
                  }
                },
                null,
                { enableHighAccuracy: true }
              );
            }
          }}
          className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
          title="Centrar en mi ubicación"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Lista de recicladores cercanos */}
      {nearestRecyclers.length > 0 && (
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-md max-w-xs">
          <h3 className="font-semibold text-gray-800 mb-2">
            Recicladores cercanos
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {nearestRecyclers.map(reciclador => (
              <div key={reciclador.id} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded-md">
                <div className="flex-1">
                  <span className="font-medium text-gray-800 block">{reciclador.name}</span>
                  <span className="text-green-600 font-semibold">{reciclador.distance.toFixed(1)} km</span>
                </div>
                <button
                  onClick={() => abrirEnMaps(reciclador)}
                  className="ml-2 p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  title="Ver en Google Maps"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

const style = document.createElement('style');
style.textContent = `
  .map-marker-label {
    background-color: white;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    white-space: nowrap;
    transform: translateY(8px);
  }
`;
document.head.appendChild(style);

export default MapView;