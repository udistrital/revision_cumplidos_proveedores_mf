export class CambioEstado {
    CodigoAbreviacionEstadoCumplido: string;
    CumplidoProveedorId: number;
 

    constructor(
        CodigoAbreviacionEstadoCumplido: string,
        CumplidoProveedorId:number
      
    ) {
        this.CodigoAbreviacionEstadoCumplido = CodigoAbreviacionEstadoCumplido;
        this.CumplidoProveedorId = CumplidoProveedorId;
        
    }
}