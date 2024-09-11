import { CumplidoProveedor } from "./cumplido-proveedor.model"
import { TipoPago } from "./tipo-pago.model"

export interface InformacionPago {
    Id: number
    TipoPagoId: TipoPago
    CumplidoProveedorId: CumplidoProveedor
    TipoDocumentoCobroId: number
    TipoCuentaBancariaId: number
    BancoId: number
    FechaInicial: string
    FechaFinal: string
    NumeroFactura: string
    ValorCumplido: number
    NumeroCuenta: string
    Activo: boolean
    FechaCreacion: Date
    FechaModificacion: Date
  }