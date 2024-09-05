export class SolicituDeFirma {
    NombreArchivo: string;
    NombreResponsable: string;
    CargoResponsable: string;
    DescripcionDocumento: string;
    Archivo: any; 
    constructor(
        nombreArchivo: string,
        nombreResponsable: string,
        cargoResponsable: string,
        descripcionDocumento: string,
        archivo: any 
    ) {
        this.NombreArchivo = nombreArchivo;
        this.NombreResponsable = nombreResponsable;
        this.CargoResponsable = cargoResponsable;
        this.DescripcionDocumento = descripcionDocumento;
        this.Archivo = archivo;
    }
}
