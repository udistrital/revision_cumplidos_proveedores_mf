export class Observacion {
    soporte_id: string;
    cambio_estado_id: string;
    comentario: string;
  
    constructor(soporte_id: string, cambio_estado_id: string, comentario: string) {
      this.soporte_id = soporte_id;
      this.cambio_estado_id = cambio_estado_id;
      this.comentario = comentario;
    }

}