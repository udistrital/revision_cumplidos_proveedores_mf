export interface EstadoCumplido {
       Id: number,
       Nombre: string,
       CodigoAbreviacion: string,
       Descripcion: string,
       Activo: boolean
  }

  export interface CumplidoProveedor {
       Id: number,
       NumeroContrato: string,
       VigenciaContrato: number,
       Activo: boolean,
       FechaCreacion: string,
       FechaModificacion: string
  }

  export interface CambioEstadoCumplido {
       Id: number,
       EstadoCumplidoId: EstadoCumplido,
       CumplidoProveedorId: CumplidoProveedor,
       DocumentoResponsable: number,
       CargoReponsable: string,
       Activo: boolean,
       FechaCreacion: string,
       FechaModificacion: string
  }
