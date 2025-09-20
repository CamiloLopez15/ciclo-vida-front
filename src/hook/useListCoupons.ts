/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import { HttpClient } from '../services/Http';
import { ICoupon, IApiError } from '../types/credits.types';

/**
 * @interface ListCouponsParams
 * @description Parámetros opcionales para filtrar la lista de cupones.
 */
interface ListCouponsParams {
    categoria?: string;
    empresa?: string;
}

/**
 * @interface UseListCouponsReturn
 * @description Define el tipo de retorno del hook `useListCoupons`.
 */
interface UseListCouponsReturn {
    coupons: ICoupon[] | null;
    loading: boolean;
    error: IApiError | null;
    fetchCoupons: (params?: ListCouponsParams) => Promise<void>;
}

/**
 * Custom Hook para obtener la lista de cupones disponibles.
 * Encapsula la lógica de la llamada a la API, el estado de carga, los datos y los errores.
 * @returns {UseListCouponsReturn} - Un objeto con la lista de cupones, estado de carga, error y la función para obtener los datos.
 */
export const useListCoupons = (): UseListCouponsReturn => {
    const [coupons, setCoupons] = useState<ICoupon[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<IApiError | null>(null);

    const apiClient = HttpClient.getInstance();

    /**
     * Función para obtener los cupones desde la API.
     * @param {ListCouponsParams} params - Parámetros de filtro opcionales.
     */
    const fetchCoupons = useCallback(async (params?: ListCouponsParams) => {
        setLoading(true);
        setError(null);

        try {
            // Construir la URL con los parámetros de consulta si existen
            const queryString = params ? new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined) as any).toString() : '';
            const url = `/api/coupons${queryString ? `?${queryString}` : ''}`;

            const response = await apiClient.get<{ success: boolean; data: ICoupon[]; count: number }>(url);

            if (response.success) {
                setCoupons(response.data);
            } else {
                setError({ message: (response as any).message || 'No se pudieron obtener los cupones.' });
            }
        } catch (err: any) {
            const errorData = err.response?.data;
            setError({
                message: errorData?.message || 'Ocurrió un error al buscar los cupones.',
                details: errorData?.details || err.message,
            });
        } finally {
            setLoading(false);
        }
    }, [apiClient]);

    return { coupons, loading, error, fetchCoupons };
};
