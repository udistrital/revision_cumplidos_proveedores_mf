import { Acciones } from "../acciones.model";

export interface CumplidosReversibles{
  CumplidoId: number,
  NumeroContrato: string,
  Vigencia: number,
  Rp: string,
  VigenciaRp: string,
  FechaAprobacion: Date,
  NombreProveedor: string,
  Dependencia: string,
  acciones: Acciones[]
}
