export class CambioEstado {
    EstadoCumplidoId: number;
    CumplidoProveedorId: number;
    DocumentoResponsable: string;
    CargoResponsable: string;

    constructor(
        EstadoCumplidoId: number,
        CumplidoProveedorId: number,
        DocumentoResponsable: string,
        CargoResponsable: string
    ) {
        this.EstadoCumplidoId = EstadoCumplidoId;
        this.CumplidoProveedorId = CumplidoProveedorId;
        this.DocumentoResponsable = DocumentoResponsable;
        this.CargoResponsable = CargoResponsable;
    }
}