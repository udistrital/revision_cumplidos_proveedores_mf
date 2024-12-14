export interface AsignacionEvaluadorBody {
  Id?: number | null;
  PersonaId: string;
  EvaluacionId?: { Id: number };
  Cargo: string;
  PorcentajeEvaluacion: number;
  ItemsAEvaluar?: any[];
  RolAsignacionEvaluadorId?:{
    Id?: number;
  }
}


export interface AsignacionEvaluador {
  Id: number;
  PersonaId: number;
  EvaluacionId: number;
  Cargo: string;
  PorcentajeEvaluacion: number;
}

