import { AsignacionEvaluador } from "./asignacion_evaluador.model";
import { Clasificacion } from "./clasificacion.model";

export interface ResultadoEvaluacion {
  Id: number;
  AsignacionEvaluadorId: AsignacionEvaluador;
  ClasificacionId: Clasificacion;
  ResultadoEvaluacion: string;
  Observaciones: string;
} 