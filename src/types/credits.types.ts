/* eslint-disable @typescript-eslint/no-explicit-any */

// Basado en la documentación CREDITS_COUPONS_MODULE.md

/**
 * @enum EstadoCuponReclamado
 * @description Define los posibles estados de un cupón que ha sido reclamado por un usuario.
 */
export enum EstadoCuponReclamado {
    ACTIVO = 'activo',
    USADO = 'usado',
    VENCIDO = 'vencido',
    CANCELADO = 'cancelado',
}

/**
 * @enum TipoTransaccion
 * @description Define los tipos de transacciones de créditos.
 */
export enum TipoTransaccion {
    GANADOS = 'ganados',
    GASTADOS = 'gastados',
    BONUS = 'bonus',
    AJUSTE = 'ajuste',
}

/**
 * @interface ICoupon
 * @description Define la estructura de un cupón disponible en la plataforma.
 */
export interface ICoupon {
    id: string;
    titulo: string;
    descripcion: string;
    costoCreditosRequeridos: number;
    categoria: string;
    empresa: string;
    valorDescuento?: number;
    porcentajeDescuento?: number;
    fechaVencimiento?: string; // Se maneja como string para simplicidad en el frontend
    imagenUrl?: string;
    terminosCondiciones?: string;
    cantidadDisponible?: number;
    activo: boolean;
    fechaCreacion: string;
    fechaActualizacion: string;
}

/**
 * @interface IClaimCouponPayload
 * @description Define la estructura del cuerpo de la petición para reclamar un cupón.
 */
export interface IClaimCouponPayload {
    couponId: string;
}

/**
 * @interface IClaimedCoupon
 * @description Define la estructura de un cupón que ya ha sido reclamado.
 */
export interface IClaimedCoupon {
    id: string;
    usuarioId: string;
    couponId: string;
    fecha: string;
    estado: EstadoCuponReclamado;
    codigoCanjeado: string;
    fechaVencimiento?: string;
}

/**
 * @interface IClaimCouponResponseData
 * @description Define la estructura del objeto 'data' en la respuesta exitosa al reclamar un cupón.
 */
export interface IClaimCouponResponseData {
    claimedCoupon: IClaimedCoupon;
    creditosRestantes: number;
    codigoCanjeado: string;
}

/**
 * @interface IApiError
 * @description Define una estructura estándar para los errores de la API.
 */
export interface IApiError {
    message: string;
    details?: any;
}
