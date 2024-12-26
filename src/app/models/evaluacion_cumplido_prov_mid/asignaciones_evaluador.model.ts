import { EstadoAsignacionEvaluador } from "../evaluacion_cumplido_prov_crud/estado_asignacion_evaluador.model";
import { EstadoEvaluacion } from "../evaluacion_cumplido_prov_crud/estado_evaluacion.model";

export interface AsignacionEvaluacion {
  Asignaciones: Asignacion[];
  SinAsignaciones: Asignacion[];
}

export interface Asignacion {
  AsignacionEvaluacionId: number;
  NombreProveedor: string;
  RolEvaluador: string;
  Dependencia: string;
  TipoContrato: string;
  NumeroContrato: string;
  VigenciaContrato: string;
  EvaluacionId: number;
  EstadoAsignacionEvaluador: EstadoAsignacionEvaluador | null;
  EstadoEvaluacion: EstadoEvaluacion | null;
}
