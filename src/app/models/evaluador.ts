import { Item } from "./evaluacion_cumplido_prov_crud/item.model";
import { ItemAEvaluar } from "./item_a_evaluar";

export interface Evaluador {
    NumeroDocumento: number;
    Cargo: string;
    ItemAEvaluar: Item[];
    PorcentajeDeEvaluacion: number;
    acciones:any [];
}
