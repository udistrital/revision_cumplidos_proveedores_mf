import { CumplidoProveedor } from "./cambio-estado-cumplido.model";
import { TipoPago } from "./tipo_pago.model";

export interface InformacionPago {
  Id: number;
  TipoPagoId: TipoPago | null;
  CumplidoProveedorId: CumplidoProveedor | null;
  TipoDocumentoCobroId: number;
  TipoCuentaBancariaId: number;
  BancoId: number;
  FechaInicial: Date;
  FechaFinal: Date;
  NumeroFactura: string;
  ValorCumplido: number;
  NumeroCuenta: string;
  Activo: boolean;
  FechaCreacion: Date;
  FechaModificacion: Date;
}
