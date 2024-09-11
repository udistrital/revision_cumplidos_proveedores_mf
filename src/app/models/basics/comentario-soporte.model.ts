import { CambioEstadoCumplido } from "./cambio-estado-cumplio.model";
import { SoporteCumplido } from "./soporte-cumplido.model";

export interface ComentarioSoporte {
  Id: number;
  SoporteCumplidoId: SoporteCumplido;
  CambioEstadoCumplidoId: CambioEstadoCumplido;
  Comentario: string;
  Activo: boolean;
  FechaCreacion: Date;
  FechaModificacion: Date;
}

