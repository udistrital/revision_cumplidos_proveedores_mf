import { ItemAEvaluar } from "./item_a_evaluar";

export interface Evaluador {
    NumeroDocumento: number;
    Cargo: string;
    ItemAEvaluar: ItemAEvaluar[];
    PorcentajeDeEvaluacion: string;
    acciones:any [];
}
