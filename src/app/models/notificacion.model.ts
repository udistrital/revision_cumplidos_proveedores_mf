export class Notificacion {
    sistema_id: string;
    tipo_notificacion_id: string;
    destinatarios: string[];
    remitente: string;
    asunto: string;
    mensaje: string;
    lectura: boolean;
    metadatos: any;
    activo: boolean;

    constructor(
        sistema_id: string,
        tipo_notificacion_id: string,
        destinatarios: string[],
        remitente: string,
        asunto: string,
        mensaje: string,
        lectura: boolean,
        metadatos: any,
        activo: boolean
    ) {
        this.sistema_id = sistema_id;
        this.tipo_notificacion_id = tipo_notificacion_id;
        this.destinatarios = destinatarios;
        this.remitente = remitente;
        this.asunto = asunto;
        this.mensaje = mensaje;
        this.lectura = lectura;
        this.metadatos = metadatos;
        this.activo = activo;
    }
}