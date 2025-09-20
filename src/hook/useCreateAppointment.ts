import { useState } from 'react';
import { HttpClient } from '../services/Http';

/**
 * Representa un Timestamp estilo Firestore recibido/enviado por el backend
 */
interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

/**
 * Payload para crear una cita (appointment)
 * Basado en el curl proporcionado
 */
export interface AppointmentCreatePayload {
  clienteId: string;
  recicladorId: string;
  fecha: FirestoreTimestamp;
  direccion: string;
  cantidadAproxMaterial: number;
  descripcion: string;
  materials: string[];
  estado: 'pendiente' | 'aceptada' | 'en_progreso' | 'completada' | 'cancelada';
}

/**
 * Estructura de la cita que devuelve el backend al crear (estimada)
 * Ajusta este tipo si tu backend retorna un shape distinto
 */
export interface Appointment {
  id: string;
  clienteId: string;
  recicladorId: string;
  fecha: FirestoreTimestamp | string; // el backend podría serializar a ISO string
  direccion: string;
  cantidadAproxMaterial: number;
  descripcion: string;
  estado: 'pendiente' | 'aceptada' | 'en_progreso' | 'completada' | 'cancelada';
  createdAt?: string;
}

/**
 * Respuesta estándar esperada del backend
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * Error normalizado para exponer en el hook
 */
interface ApiError {
  message: string;
  details?: unknown;
}

interface UseCreateAppointmentReturn {
  data: Appointment | null;
  loading: boolean;
  error: ApiError | null;
  createAppointment: (payload: AppointmentCreatePayload) => Promise<Appointment | null>;
}

/**
 * Hook para crear una cita vía POST /api/appointments
 * Mantiene el estilo de hooks existentes: data, loading, error y función de acción.
 */
export const useCreateAppointment = (): UseCreateAppointmentReturn => {
  const [data, setData] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const apiClient = HttpClient.getInstance();

  const createAppointment = async (payload: AppointmentCreatePayload): Promise<Appointment | null> => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await apiClient.post<
        AppointmentCreatePayload,
        ApiResponse<Appointment>
      >('/appointments', payload);

      if (response.success && response.data) {
        setData(response.data);
        
        // Devolver la cita creada
        return response.data;
      } else {
        setError({ message: response.message || 'No se pudo crear la cita.' });
        return null;
      }
    } catch (err: any) {
      const errorData = err?.response?.data;
      setError({
        message: errorData?.message || errorData?.error || 'Error al crear la cita.',
        details: errorData || err?.message,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, createAppointment };
};
