import { HttpClient } from "./Http";
import {
  CreateReviewData,
  GetReviewsResponse,
  CreateReviewResponse,
} from "../types/review.types";

/**
 * Objeto de servicio para agrupar las llamadas a la API relacionadas con las reseñas.
 */
export const ReviewService = {
  /**
   * Obtiene la lista de reseñas para un reciclador específico, con paginación.
   * @param recyclerId - El ID del reciclador.
   * @param params - Parámetros opcionales para la paginación (limit, startAfter).
   * @returns Una promesa que se resuelve con los datos de las reseñas y la paginación.
   */
  getReviews: async (
    recyclerId: string,
    params?: { limit?: number; startAfter?: string }
  ): Promise<GetReviewsResponse> => {
    const client = HttpClient.getInstance();
    // Asumimos que la respuesta de la API envuelve los datos en una propiedad `data`.
    const response = await client.get<{ success: boolean, data: GetReviewsResponse }>(
      `/recyclers/${recyclerId}/reviews`,
      { params }
    );
    return response.data;
  },

  /**
   * Crea una nueva reseña para un reciclador.
   * @param recyclerId - El ID del reciclador que está siendo reseñado.
   * @param reviewData - Los datos de la reseña (usuarioId, rating, comentario).
   * @returns Una promesa que se resuelve con los datos de la reseña creada.
   */
  createReview: async (
    recyclerId: string,
    reviewData: CreateReviewData
  ): Promise<CreateReviewResponse> => {
    const client = HttpClient.getInstance();
    // El cliente HTTP devuelve la propiedad `data` de la respuesta de axios.
    // La documentación indica que la API devuelve { success, message, data: { ...review } }.
    // Por lo tanto, extraemos la reseña de la propiedad `data` interna.
    const response = await client.post<CreateReviewData, {
      success: boolean;
      message: string;
      data: CreateReviewResponse;
    }>(
        `/recyclers/${recyclerId}/reviews`,
        reviewData
    );
    return response.data;
  },
};
