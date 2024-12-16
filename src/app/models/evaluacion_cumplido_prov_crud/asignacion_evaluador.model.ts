import { ItemAEvaluar } from "../item_a_evaluar";
import { Item } from "./item.model";

export interface AsignacionEvaluadorBody {
  PersonaId: number;
  EvaluacionId: {
      Id: number;
  };
  Cargo: string;
  PorcentajeEvaluacion: number;
  ItemsAEvaluar: number[];
}


export interface AsignacionEvaluador {
  Id: number;
  PersonaId: number;
  EvaluacionId: {
      Id: number;
  };
  Cargo: string;
  PorcentajeEvaluacion: number;
}

