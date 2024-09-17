import { CambioEstado } from "./cambio-estado.model";
import { SoporteCumplido } from "./soporte_cumplido.model";

export interface Observacion {
    SoporteCumplidoId: number;
    CambioEstadoCumplidoId: number;
    Comentario: string;
}