export interface InformacionDocumentoEvaluacion {
  EmpresaProveedor: string;
  Documento: string;
  ObjetoContrato: string;
  Dependencia: string;
  ResultadoFinalEvaluacion: ResultadoFinalEvaluacion;
}

export interface EvaluadorDocumento {
  Nombre: string;
  Cargo: string;
  Items: string;
  Rol: string;
}

export interface ResultadoDocumentoEvaluacion {
  Categoria?: string;
  Titulo?: string;
  Pregunta?: string;
  Cumplimiento?: string;
  ValorAsignado?: number;
}

export interface ResultadoFinalEvaluacion {
  Evaluadores: EvaluadorDocumento[];
  Resultados: ResultadoDocumentoEvaluacion[];
}
export interface ItemsDocuementoEvaluacion {
    Nombre: string;
  }

  export interface SubcategoriasDocuementoEvaluacion {
    Items:ItemsDocuementoEvaluacion[];
    Nombre: string;
  }
