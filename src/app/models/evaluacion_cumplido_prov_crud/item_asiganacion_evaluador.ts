import { Evaluacion } from "./evaluacion.model";
import { Item } from "./item.model";

export interface AsignacionEvaluadorItem{
    Id: number;
    AsignacionEvaluadorId: AsignacionEvaluadorDetails;
    ItemId: Item;
    Activo: boolean;
    FechaCreacion: string;
    FechaModificacion: string;
  }

  export interface AsignacionEvaluadorDetails {
    Id: number;
    EvaluacionId: Evaluacion;
    PersonaId: string;
    Cargo: string;
    PorcentajeEvaluacion: number;
    RolAsignacionEvaluadorId: RolDetails;
    Activo: boolean;
    FechaCreacion: string;
    FechaModificacion: string;
  }
  export interface RolDetails {
    Id: number;
    Nombre: string;
    Descripcion: string;
    CodigoAbreviacion: string;
    Activo: boolean;
  }