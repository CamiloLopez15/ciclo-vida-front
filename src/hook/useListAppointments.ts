/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import { HttpClient } from '../services/Http';
import type { Appointment } from './useCreateAppointment';

interface ApiError {
  message: string;
  details?: unknown;
}

interface UseListAppointmentsReturn {
  appointments: Appointment[] | null;
  loading: boolean;
  error: ApiError | null;
  fetchAppointments: () => Promise<void>;
}

/**
 * Hook para obtener la lista de citas vía GET /appointments
 * Maneja tanto respuestas crudas (Array<Appointment>) como envueltas ({ success, data })
 */
export const useListAppointments = (): UseListAppointmentsReturn => {
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const api = HttpClient.getInstance();

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // La API podría responder como array directo o como { success, data }
      const resp = await api.get<any>('/appointments');

      if (Array.isArray(resp)) {
        setAppointments(resp as Appointment[]);
        return;
      }

      if (resp?.success && Array.isArray(resp?.data)) {
        setAppointments(resp.data as Appointment[]);
        return;
      }

      // Forma no reconocida
      setError({ message: 'Formato de respuesta no válido al listar citas.' });
    } catch (err: any) {
      const errorData = err?.response?.data;
      setError({
        message: errorData?.message || errorData?.error || 'Error al obtener las citas.',
        details: errorData || err?.message,
      });
    } finally {
      setLoading(false);
    }
  }, [api]);

  return { appointments, loading, error, fetchAppointments };
};
