import { ComentarioSoporte } from "./basics/comentario-soporte.model";


  
  export interface SoporteCumplido {
    SoporteCumplidoId: number
    Documento: Documento
    Archivo: Archivo
    Comentarios: ComentarioSoporte[]
  }
  
  export interface Documento {
    Id: number
    Nombre: string
    TipoDocumento: string
    Descripcion: string
    Observaciones: string
    FechaCreacion: string
  }
  
  export interface Archivo {
    File: string
  }