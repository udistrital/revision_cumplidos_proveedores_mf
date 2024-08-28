export class Documento {
    Id: number;
    Nombre: string;
    TipoDocumento: string;
    Descripcion: string;
    Observaciones: string;
    FechaCreacion: string;
    
  
    constructor(
      Id: number,
      Nombre: string,
      TipoDocumento: string,
      Descripcion: string,
      Observaciones: string,
      FechaCreacion: string
    ) {
      this.Id = Id;
      this.Nombre = Nombre;
      this.TipoDocumento = TipoDocumento;
      this.Descripcion = Descripcion;
      this.Observaciones = Observaciones;
      this.FechaCreacion = FechaCreacion;
    }
  }
  
  export class Archivo {
    File: string;
  
    constructor(File: string) {
      this.File = File;
    }
  }
  
  export class SoporteCumplido {
    Documento: Documento;
    Archivo: Archivo;
  
    constructor(Documento: Documento, Archivo: Archivo) {
      this.Documento = Documento;
      this.Archivo = Archivo;
    }
  }
  