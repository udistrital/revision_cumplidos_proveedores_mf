export class EstadoCumplido {
    constructor(
      public Id: number,
      public Nombre: string,
      public CodigoAbreviacion: string,
      public Descripcion: string,
      public Activo: boolean
    ) {}
  }

  export class CumplidoProveedor {
    constructor(
      public Id: number,
      public NumeroContrato: string,
      public VigenciaContrato: number,
      public Activo: boolean,
      public FechaCreacion: string, 
      public FechaModificacion: string
    ) {}
  }

  export class CambioEstadoCumplido {
    constructor(
      public Id: number,
      public EstadoCumplidoId: EstadoCumplido,
      public CumplidoProveedorId: CumplidoProveedor,
      public DocumentoResponsable: number,
      public CargoReponsable: string,
      public Activo: boolean,
      public FechaCreacion: string,
      public FechaModificacion: string 
    ) {}
  }