import { CambioEstado } from "./cambio-estado.model";
import { SoporteCumplido } from "./soporte_cumplido.model";

export class Observacion {
    SoporteCumplidoId: Object;
    CambioEstadoCumplidoId: Object;
    Comentario: string;
  
    constructor(soporte_id: number, cambio_estado_id: number, comentario: string) {
      this.SoporteCumplidoId = {
        id: soporte_id
      };
      this.CambioEstadoCumplidoId = {
        id:cambio_estado_id
      };
      this.Comentario = comentario;
    }

}