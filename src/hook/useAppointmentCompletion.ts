import { useState } from 'react';
import { HttpClient } from '../services/Http';
import {
    AppointmentCompletionPayload,
    AppointmentCompletionResponse
} from '../types/appointmentCompletion.types';

/**
 * @interface ApiError
 * @description Define una estructura estándar para los errores de la API.
 */
interface ApiError {
    message: string;
    details?: any;
}

/**
 * @interface UseAppointmentCompletionReturn
 * @description Define el tipo de retorno del hook `useAppointmentCompletion`.
 */
interface UseAppointmentCompletionReturn {
    data: AppointmentCompletionResponse | null;
    loading: boolean;
    error: ApiError | null;
    completeAppointment: (appointmentId: string, payload: AppointmentCompletionPayload) => Promise<void>;
}

/**
 * Custom Hook para manejar la finalización de una cita.
 * Encapsula la lógica de la llamada a la API, el estado de carga, los datos y los errores.
 * @returns {UseAppointmentCompletionReturn} - Un objeto con el estado y la función para completar la cita.
 */
export const useAppointmentCompletion = (): UseAppointmentCompletionReturn => {
    const [data, setData] = useState<AppointmentCompletionResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);

    const apiClient = HttpClient.getInstance();

    /**
     * Función para llamar al endpoint de finalización de cita.
     * @param {string} appointmentId - El ID de la cita a completar.
     * @param {AppointmentCompletionPayload} payload - Los datos para completar la cita.
     */
    const completeAppointment = async (appointmentId: string, payload: AppointmentCompletionPayload) => {
        setLoading(true);
        setError(null);
        setData(null);

        try {
            // La respuesta de la API tiene una estructura { success, message, data }
            const response = await apiClient.post<
                AppointmentCompletionPayload,
                { success: boolean; data: AppointmentCompletionResponse; message: string }
            >(
                `/api/appointments/${appointmentId}/complete`,
                payload
            );

            if (response.success) {
                setData(response.data);
            } else {
                // Si la API responde con success: false pero sin lanzar un error HTTP
                setError({ message: response.message || 'Ocurrió un error desconocido.' });
            }
        } catch (err: any) {
            // Axios envuelve el error de la API en err.response.data
            const errorData = err.response?.data;
            setError({
                message: errorData?.message || 'No se pudo completar la cita.',
                details: errorData?.details || err.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, completeAppointment };
};
