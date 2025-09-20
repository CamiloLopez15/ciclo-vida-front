import { Ciudadano, Reciclador, Recoleccion, Valoracion } from '../types';

export const mockCiudadanos: Ciudadano[] = [
  {
    id: '1',
    email: 'maria@email.com',
    name: 'María González',
    phone: '+57 300 123 4567',
    type: 'ciudadano',
    address: 'Calle 72 #10-34, Chapinero, Bogotá',
    coordinates: { lat: 4.6533, lng: -74.0836 },
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    email: 'carlos@email.com',
    name: 'Carlos Rodríguez',
    phone: '+57 301 234 5678',
    type: 'ciudadano',
    address: 'Carrera 15 #85-20, Zona Rosa, Bogotá',
    coordinates: { lat: 4.6697, lng: -74.0648 },
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: '2024-01-20T14:30:00Z'
  }
];

export const mockRecicladores: Reciclador[] = [
  {
    id: '3',
    email: 'ana@email.com',
    name: 'Ana Martínez',
    phone: '+57 302 345 6789',
    type: 'reciclador',
    coverageAreas: ['Chapinero', 'Zona Rosa', 'La Candelaria'],
    rating: 4.8,
    totalRecolecciones: 156,
    description: 'Recicladora con 5 años de experiencia. Especializada en papel, cartón y plásticos.',
    workingHours: { start: '07:00', end: '17:00' },
    coordinates: { lat: 4.6482, lng: -74.0776 },
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: '2023-08-10T09:00:00Z'
  },
  {
    id: '4',
    email: 'pedro@email.com',
    name: 'Pedro Sánchez',
    phone: '+57 303 456 7890',
    type: 'reciclador',
    coverageAreas: ['Suba', 'Engativá', 'Fontibón'],
    rating: 4.6,
    totalRecolecciones: 89,
    description: 'Reciclador comprometido con el medio ambiente. Trabajo con todo tipo de materiales.',
    workingHours: { start: '06:00', end: '16:00' },
    coordinates: { lat: 4.7110, lng: -74.0721 },
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: '2023-11-05T11:15:00Z'
  }
];

export const mockRecolecciones: Recoleccion[] = [
  {
    id: '1',
    ciudadanoId: '1',
    recicladorId: '3',
    fecha: '2024-01-25',
    hora: '10:00',
    direccion: 'Calle 72 #10-34, Chapinero, Bogotá',
    coordinates: { lat: 4.6533, lng: -74.0836 },
    tipoMaterial: ['Papel', 'Cartón', 'Plástico'],
    descripcion: 'Cajas de cartón, periódicos y botellas plásticas',
    estado: 'completada',
    createdAt: '2024-01-20T15:30:00Z'
  },
  {
    id: '2',
    ciudadanoId: '1',
    fecha: '2024-01-28',
    hora: '14:00',
    direccion: 'Calle 72 #10-34, Chapinero, Bogotá',
    coordinates: { lat: 4.6533, lng: -74.0836 },
    tipoMaterial: ['Vidrio', 'Metal'],
    descripcion: 'Botellas de vidrio y latas de aluminio',
    estado: 'pendiente',
    createdAt: '2024-01-26T09:15:00Z'
  },
  {
    id: '3',
    ciudadanoId: '2',
    fecha: '2024-01-29',
    hora: '10:00',
    direccion: 'Carrera 15 #85-20, Zona Rosa, Bogotá',
    coordinates: { lat: 4.6697, lng: -74.0648 },
    tipoMaterial: ['Papel', 'Cartón'],
    descripcion: 'Documentos y cajas de embalaje',
    estado: 'pendiente',
    createdAt: '2024-01-27T11:00:00Z'
  },
  {
    id: '4',
    ciudadanoId: '1',
    recicladorId: '4',
    fecha: '2024-01-30',
    hora: '15:00',
    direccion: 'Calle 72 #10-34, Chapinero, Bogotá',
    coordinates: { lat: 4.6533, lng: -74.0836 },
    tipoMaterial: ['Plástico', 'Metal'],
    descripcion: 'Envases plásticos y latas',
    estado: 'aceptada',
    createdAt: '2024-01-28T16:20:00Z'
  }
];

export const mockValoraciones: Valoracion[] = [
  {
    id: '1',
    recoleccionId: '1',
    ciudadanoId: '1',
    recicladorId: '3',
    rating: 5,
    comentario: 'Excelente servicio, muy puntual y amable. Recomendado 100%',
    createdAt: '2024-01-25T16:00:00Z'
  },
  {
    id: '2',
    recoleccionId: '4',
    ciudadanoId: '1',
    recicladorId: '4',
    rating: 4,
    comentario: 'Buen servicio, llegó a tiempo y fue muy profesional',
    createdAt: '2024-01-30T16:30:00Z'
  },
  {
    id: '3',
    recoleccionId: '1',
    ciudadanoId: '2',
    recicladorId: '3',
    rating: 5,
    comentario: 'Ana es increíble! Muy profesional y educada. Llegó exactamente a la hora acordada y manejó todos los materiales con mucho cuidado.',
    createdAt: '2024-01-26T14:15:00Z'
  },
  {
    id: '4',
    recoleccionId: '2',
    ciudadanoId: '1',
    recicladorId: '3',
    rating: 4,
    comentario: 'Muy buen trabajo, solo llegó 10 minutos tarde pero el servicio fue excelente.',
    createdAt: '2024-01-28T11:45:00Z'
  },
  {
    id: '5',
    recoleccionId: '3',
    ciudadanoId: '2',
    recicladorId: '4',
    rating: 5,
    comentario: 'Pedro es muy eficiente y amable. Explicó todo el proceso de reciclaje muy bien.',
    createdAt: '2024-01-29T16:20:00Z'
  },
  {
    id: '6',
    recoleccionId: '4',
    ciudadanoId: '1',
    recicladorId: '4',
    rating: 3,
    comentario: 'Servicio correcto, aunque podría mejorar la comunicación previa.',
    createdAt: '2024-01-31T09:30:00Z'
  }
];

export const mockNotificaciones = [
  {
    id: '1',
    userId: '1',
    tipo: 'recoleccion_aceptada' as const,
    titulo: 'Recolección Aceptada',
    mensaje: 'Ana Martínez ha aceptado tu solicitud de recolección para mañana a las 10:00 AM',
    leida: false,
    createdAt: '2024-01-28T09:30:00Z',
    metadata: { recoleccionId: '4' }
  },
  {
    id: '2',
    userId: '1',
    tipo: 'recordatorio' as const,
    titulo: 'Recordatorio de Recolección',
    mensaje: 'Tu recolección está programada para hoy a las 14:00. Prepara los materiales.',
    leida: false,
    createdAt: '2024-01-28T08:00:00Z',
    metadata: { recoleccionId: '2' }
  },
  {
    id: '3',
    userId: '3',
    tipo: 'nueva_valoracion' as const,
    titulo: 'Nueva Valoración Recibida',
    mensaje: 'María González te ha dado 5 estrellas. ¡Excelente trabajo!',
    leida: true,
    createdAt: '2024-01-25T16:30:00Z',
    metadata: { valoracionId: '1' }
  },
  {
    id: '4',
    userId: '3',
    tipo: 'recoleccion_completada' as const,
    titulo: 'Recolección Completada',
    mensaje: 'Has completado exitosamente la recolección en Calle 72 #10-34',
    leida: true,
    createdAt: '2024-01-25T15:45:00Z',
    metadata: { recoleccionId: '1' }
  }
]