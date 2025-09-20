/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { HttpClient } from '../services/Http';
import {
    IClaimCouponPayload,
    IClaimCouponResponseData,
    IApiError
} from '../types/credits.types';

/**
 * @interface UseClaimCouponReturn
 * @description Define el tipo de retorno del hook `useClaimCoupon`.
 */
interface UseClaimCouponReturn {
    data: IClaimCouponResponseData | null;
    loading: boolean;
    error: IApiError | null;
    claimCoupon: (userId: string, payload: IClaimCouponPayload) => Promise<void>;
}

/**
 * Custom Hook para manejar la reclamación de un cupón.
 * Encapsula la lógica de la llamada a la API, el estado de carga, los datos y los errores.
 * @returns {UseClaimCouponReturn} - Un objeto con el estado y la función para reclamar un cupón.
 */
export const useClaimCoupon = (): UseClaimCouponReturn => {
    const [data, setData] = useState<IClaimCouponResponseData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<IApiError | null>(null);

    const apiClient = HttpClient.getInstance();

    /**
     * Función para llamar al endpoint de reclamación de cupón.
     * @param {string} userId - El ID del usuario que reclama el cupón.
     * @param {IClaimCouponPayload} payload - Los datos para reclamar el cupón (el ID del cupón).
     */
    const claimCoupon = async (userId: string, payload: IClaimCouponPayload) => {
        setLoading(true);
        setError(null);
        setData(null);

        try {
            const response = await apiClient.post<
                IClaimCouponPayload,
                { success: boolean; data: IClaimCouponResponseData; message: string }
            >(
                `/api/users/${userId}/claim-coupon`,
                payload
            );

            if (response.success) {
                setData(response.data);
            } else {
                setError({ message: response.message || 'Ocurrió un error desconocido.' });
            }
        } catch (err: any) {
            const errorData = err.response?.data;
            setError({
                message: errorData?.reason || errorData?.error || 'No se pudo reclamar el cupón.',
                details: errorData || err.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, claimCoupon };
};
