import { Item } from "../evaluacion_cumplido_prov_crud/item.model";


export interface InformacionEvaluacion {
  NombreEvaluador: string;
  Cargo: string;
  CodigoAbreviacionRol: string;
  DependenciaEvaluadora: string;
  FechaEvaluacion: string;
  EmpresaProveedor: string;
  ObjetoContrato: string;
  PuntajeTotalEvaluacion: number;
  Clasificacion: string;
  ItemsEvaluados: Item[];
  Evaluadores: Evaluador[];
  ResultadoEvaluacion: Resultado;
}

export interface Evaluador {
  Documento: string;
  Cargo: string;
  PorcentajeEvaluacion: number;
  Rol: string;
  ItemEvaluado: string;
  PuntajeEvaluacion: number;
  EstadoEvaluacion: string;
  Observaciones: string;
}

export interface Resultado {
  ResultadosIndividuales: ResultadoIndividual[];
}

export interface ResultadoIndividual {
  Categoria: string;
  Titulo: string;
  Respuesta: Respuesta;
}

export interface Respuesta {
  Pregunta: string;
  Cumplimiento: string;
  ValorAsignado: number;
}
