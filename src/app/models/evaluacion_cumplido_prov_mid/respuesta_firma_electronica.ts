export interface DominioTipoDocumento {
    Id: number;
    Nombre: string;
    Descripcion: string;
    CodigoAbreviacion: string;
    Activo: boolean;
    NumeroOrden: number;
  }
  
  export interface TipoDocumento {
    Id: number;
    Nombre: string;
    Descripcion: string;
    CodigoAbreviacion: string;
    Activo: boolean;
    NumeroOrden: number;
    Tamano: number;
    Extension: string;
    Workspace: string;
    TipoDocumentoNuxeo: string;
    DominioTipoDocumento: DominioTipoDocumento;
  }
  
  export interface Firmante {
    Cargo: string;
    Identificacion: string;
    Nombre: string;
    TipoId: string;
  }
  
  export interface Res {
    Id: number;
    Nombre: string;
    Descripcion: string;
    Enlace: string;
    TipoDocumento: TipoDocumento;
    Metadatos: string;
    Activo: boolean;
  }
  
  export interface RespuestaFirmaElectronica {
    Status: string;
    res: Res;
  }
  