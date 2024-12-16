
export interface Evaluacion{
  Id: number;
  ContratoSuscritoId: number;
  VigenciaContrato: number;
  DocumentoId: number;
  Activo: boolean;
  FechaCreacion: Date;
  FechaModificacion: Date;
}