export interface DocumentoHistorico {
    Id: number;
    Nombre: string;
    TipoDocumento: string;
    CodigoAbreviacionTipoDocumento: string;
    Descripcion: string;
    Observaciones: string;
    FechaCreacion: string;
}

interface Archivo {
    File: string;
}

export interface SoporteEstados {
    SoporteCumplidoId: number;
    Documento: DocumentoHistorico;
    Archivo: Archivo;
}