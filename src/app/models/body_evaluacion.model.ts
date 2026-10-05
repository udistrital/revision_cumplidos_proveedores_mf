export interface BodyEvaluacion {
  AsignacionEvaluadorId: number;
  ClasificacionId: number;
  Observaciones: string;
  ResultadoEvaluacion: {
    ResultadosIndividuales: {
      Categoria: string;
      Titulo: string;
      Respuesta: {
        Pregunta: string;
        Cumplimiento: string;
        ValorAsignado: number;
      };
    }[];
  };
}