import { Evaluacion } from "./evaluacion.model";

export interface AsignacionEvaluadorBody {
  Id?: number | null;
  PersonaId: string;
  EvaluacionId?: { Id: number };
  Cargo: string;
  PorcentajeEvaluacion: number;
  ItemsAEvaluar?: number[];
  RolAsignacionEvaluadorId?:{
    Id?: number;
  }
}


export interface AsignacionEvaluador {
  Id: number;
  PersonaId: number;
  EvaluacionId: Evaluacion;
  Cargo: string;
  PorcentajeEvaluacion: number;
}

export interface TransaccionAsignacionEvaluador {
  Id?: number | null;
  EvaluacionId?: number;
  PersonaId: string;
  Cargo: string;
  PorcentajeEvaluacion: number;
  RolAsignacionEvaluador: string;
  ItemsAEvaluar?: number[];
}
