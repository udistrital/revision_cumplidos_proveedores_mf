export interface NotificacionBody{
    sistema_id: string;
    tipo_notificacion_id: string;
    destinatarios: string[];
    remitente: string;
    asunto: string;
    mensaje: string;
    lectura: boolean;
    metadatos: any;
    activo: boolean;
}
