export class AutorizacioPago {
    public SolicitudPagoID: number;
    public TipoDocumento: string;
    public ItemID: number;
    public Observaciones: string;
    public NombreArchivo: string;
    public Archivo: string;

    constructor(
        SolicitudPagoID: number,
        TipoDocumento: string,
        ItemID: number,
        Observaciones: string,
        NombreArchivo: string,
        Archivo: string
    ) {
        this.SolicitudPagoID = SolicitudPagoID;
        this.TipoDocumento = TipoDocumento;
        this.ItemID = ItemID;
        this.Observaciones = Observaciones;
        this.NombreArchivo = NombreArchivo;
        this.Archivo = Archivo;
    }

}
