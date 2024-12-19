import { EstadoEvaluacion } from "./estado_evaluacion.model";
import { Evaluacion } from "./evaluacion.model";

export interface CambioEstadoEvaluacion {
  Id: number;
  EvaluacionId: Evaluacion;
  EstadoEvaluacionId: EstadoEvaluacion;
  Activo: boolean;
  FechaCreacion: Date;
  FechaModificacion: Date;
}
