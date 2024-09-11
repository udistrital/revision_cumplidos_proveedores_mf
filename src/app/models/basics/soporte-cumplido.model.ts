import { CumplidoProveedor } from "./cumplido-proveedor.model"

export interface SoporteCumplido {
    Id: number
    CumplidoProveedorId: CumplidoProveedor
    DocumentoId: number
    Activo: boolean
    FechaCreacion: Date
    FechaModificacion: Date
  }