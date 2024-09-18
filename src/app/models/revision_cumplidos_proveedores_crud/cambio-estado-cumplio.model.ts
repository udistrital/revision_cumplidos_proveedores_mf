import { CumplidoProveedor } from "./cumplido-proveedor.model"
import { EstadoCumplido } from "./estado-cumplido.model"


export interface CambioEstadoCumplido{
    Id: number
    EstadoCumplidoId: EstadoCumplido
    CumplidoProveedorId: CumplidoProveedor
    DocumentoResponsable: number
    CargoResponsable: string
    Activo: boolean
    FechaCreacion: Date
    FechaModificacion: Date
  }