import { ComentarioSoporte } from "../revision_cumplidos_proveedores_crud/comentario-soporte.model";


  
  export interface InformacionSoporteCumplido {
    SoporteCumplidoId: number
    Documento: Documento
    Archivo: Archivo
    Comentarios: ComentarioSoporte[]
    CodigoAbreviacionTipoDocumento?:string
  }
  
  export interface Documento {
    IdTipoDocumento?:number
    Id: number
    Nombre: string
    TipoDocumento: string
    Descripcion: string
    Observaciones: string
    FechaCreacion: string
    CodigoAbreviacionTipoDocumento:string
  }
  
  export interface Archivo {
    File: string
  }