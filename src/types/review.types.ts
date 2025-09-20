// Basado en la documentación REVIEWS_MODULE.md

/**
 * Representa un único documento de valoración de Firestore.
 */
export interface Review {
  id: string;           // Autogenerado por Firebase
  recicladorId: string; // ID del reciclador
  usuarioId: string;    // ID del usuario que hace la reseña
  rating: number;       // Calificación de 1 a 5
  comentario: string;   // Comentario de la reseña
  fecha: string;        // Fecha en formato ISO string
  // Podríamos añadir datos del usuario si la API los incluyera en el futuro
  // usuario?: { nombre: string; avatar: string; };
}

/**
 * Representa las estadísticas de las valoraciones de un reciclador.
 */
export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}

/**
 * Representa la estructura de datos para la respuesta del endpoint GET /reviews.
 */
export interface GetReviewsResponse {
  reviews: Review[];
  hasMore: boolean;
  lastDoc: string; // ID del último documento para paginación
  stats: ReviewStats;
}

/**
 * Representa el cuerpo de la petición POST para crear una nueva valoración.
 */
export interface CreateReviewData {
  usuarioId: string;
  rating: number;
  comentario: string;
}

/**
 * Representa la estructura de datos de la respuesta exitosa al crear una valoración.
 */
export interface CreateReviewResponse {
    id: string;
    recicladorId: string;
    usuarioId: string;
    rating: number;
    comentario: string;
    fecha: string;
}
