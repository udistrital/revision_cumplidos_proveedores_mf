export class SolicituDeFirma {
    NombreArchivo: string;
    NombreResponsable: string;
    CargoResponsable: string;
    DescripcionDocumento: string;
    Archivo: any; // Tipo 'any' por ahora, ajusta según el tipo real de 'Archivo'

    constructor(
        nombreArchivo: string,
        nombreResponsable: string,
        cargoResponsable: string,
        descripcionDocumento: string,
        archivo: any // Tipo 'any' por ahora, ajusta según el tipo real de 'Archivo'
    ) {
        this.NombreArchivo = nombreArchivo;
        this.NombreResponsable = nombreResponsable;
        this.CargoResponsable = cargoResponsable;
        this.DescripcionDocumento = descripcionDocumento;
        this.Archivo = archivo;
    }
}
