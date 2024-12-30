import { Evaluacion } from "./evaluacion.model";


export interface BodyItem {
  Id: number;
  EvaluacionId: {
    Id: number
  };
  Identificador: string;
  Nombre: string;
  ValorUnitario: number;
  Iva: number;
  FichaTecnica: string;
  Unidad: number;
  Cantidad: number;
  TipoNecesidad: number;
}

export interface Item {
  Id: number;
  EvaluacionId: Evaluacion;
  Identificador: string;
  Nombre: string;
  ValorUnitario: number;
  Iva: number;
  FichaTecnica: string;
  Unidad: number;
  Cantidad: number;
  TipoNecesidad: string|number;
  Activo: boolean;
  FechaCreacion: Date;
  FechaModificacion: Date;
}
