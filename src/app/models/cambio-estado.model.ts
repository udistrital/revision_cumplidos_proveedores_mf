export class CambioEstado {
    CumplidoProveedorId: number;
    CodigoAbreviacionEstadoCumplido: string;

 

    constructor(
        CumplidoProveedorId:number,
        CodigoAbreviacionEstadoCumplido: string
        
      
    ) {
        this.CodigoAbreviacionEstadoCumplido = CodigoAbreviacionEstadoCumplido;
        this.CumplidoProveedorId = CumplidoProveedorId;
        
    }
}