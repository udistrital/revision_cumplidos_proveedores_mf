export class DocumentoCobro {
    Id: number;
    Nombre: string;
    Descripcion: string;
    CodigoAbreviacion: string;
    Activo: boolean;

    constructor(Id: number, Nombre: string, Descripcion: string, CodigoAbreviacion: string, Activo: boolean) {
        this.Id = Id;
        this.Nombre = Nombre;
        this.Descripcion = Descripcion;
        this.CodigoAbreviacion = CodigoAbreviacion;
        this.Activo = Activo;
    }
}