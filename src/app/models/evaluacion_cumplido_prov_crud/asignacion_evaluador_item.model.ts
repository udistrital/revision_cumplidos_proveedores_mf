import { AsignacionEvaluador } from "./asignacion_evaluador.model";
import { Item } from "./item.model";

export interface AsignacionEvaluadorItem {
  Id: number;
  AsignacionEvaluadorId: AsignacionEvaluador;
  ItemId: Item;
  }
