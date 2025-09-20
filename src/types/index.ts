export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  type: 'ciudadano' | 'reciclador';
  avatar?: string;
  createdAt: string;
}

export interface Ciudadano extends User {
  type: 'ciudadano';
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Reciclador extends User {
  type: 'reciclador';
  coverageAreas: string[];
  rating: number;
  totalRecolecciones: number;
  description: string;
  workingHours: {
    start: string;
    end: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Recoleccion {
  id: string;
  ciudadanoId: string;
  recicladorId?: string;
  fecha: string;
  hora: string;
  direccion: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  tipoMaterial: string[];
  descripcion: string;
  estado: 'pendiente' | 'aceptada' | 'en_progreso' | 'completada' | 'cancelada';
  createdAt: string;
}

export interface Valoracion {
  id: string;
  recoleccionId: string;
  ciudadanoId: string;
  recicladorId: string;
  rating: number;
  comentario: string;
  createdAt: string;
}

export interface Notificacion {
  id: string;
  userId: string;
  tipo: 'recoleccion_aceptada' | 'recoleccion_completada' | 'nueva_valoracion' | 'recordatorio' | 'sistema';
  titulo: string;
  mensaje: string;
  leida: boolean;
  createdAt: string;
  metadata?: {
    recoleccionId?: string;
    valoracionId?: string;
  };
}

export interface AdminStats {
  totalUsuarios: number;
  totalCiudadanos: number;
  totalRecicladores: number;
  totalRecolecciones: number;
  recoleccionesCompletadas: number;
  recoleccionesPendientes: number;
  promedioValoraciones: number;
  kgTotalReciclados: number;
}