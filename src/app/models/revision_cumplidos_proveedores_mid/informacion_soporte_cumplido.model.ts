import { ComentarioSoporte } from "../revision_cumplidos_proveedores_crud/comentario-soporte.model";


  
  export interface InformacionSoporteCumplido {
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