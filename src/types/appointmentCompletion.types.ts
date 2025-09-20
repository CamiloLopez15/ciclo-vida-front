// Basado en la documentación APPOINTMENT_COMPLETION_ENDPOINT.md

/**
 * @interface IDetalleMaterial
 * @description Define la estructura para el detalle de cada material reciclado.
 */
export interface IDetalleMaterial {
  tipo: string; // Tipo de material (ej. "plastico", "papel")
  cantidad: number; // Cantidad en kg
}

/**
 * @interface AppointmentCompletionPayload
 * @description Define la estructura del cuerpo (body) de la petición para completar una cita.
 */
export interface AppointmentCompletionPayload {
  fotos: string[];
  pesoTotal: number;
  detalleMaterial: IDetalleMaterial[];
  cantidadContenedores: number;
  observaciones: string;
}

/**
 * @interface AppointmentCompletionData
 * @description Define la estructura del objeto 'appointmentCompletion' en la respuesta exitosa.
 */
export interface AppointmentCompletionData {
  id: string;
  fotos: string[];
  pesoTotal: number;
  detalleMaterial: IDetalleMaterial[];
  cantidadContenedores: number;
  observaciones: string;
  valorCalculado: number;
}

/**
 * @interface AppointmentCompletionResponse
 * @description Define la estructura completa del objeto 'data' en la respuesta exitosa de la API.
 */
export interface AppointmentCompletionResponse {
  appointmentCompletion: AppointmentCompletionData;
  creditosGenerados: number;
  creditosTotal: number;
}
