export interface Item {
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