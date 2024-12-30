import { AsignacionEvaluador } from "./asignacion_evaluador.model";

export interface EstadoAsignacionEvaluador {
    Id: number;
    Nombre: string;
    CodigoAbreviacion: string;
    Descripcion: string;
    Activo: boolean;
  }
  
  

  export interface CambioEstadoAsignacionEvalacion{
    Id: number;
    EstadoAsignacionEvaluadorId: EstadoAsignacionEvaluador;
    AsignacionEvaluadorId: AsignacionEvaluador;
    Activo: boolean;
    FechaCreacion: string; 
    FechaModificacion: string; 
  }