export class TipoPago {
    Id: number;
    Nombre: string;
    Descripcion: string;
    CodigoAbreviacion: string;
    Activo: boolean;

    constructor(
        id: number,
        nombre: string,
        descripcion: string,
        codigoAbreviacion: string,
        activo: boolean = true
    ) {
        this.Id = id;
        this.Nombre = nombre;
        this.Descripcion = descripcion;
        this.CodigoAbreviacion = codigoAbreviacion;
        this.Activo = activo;
    }
}