import { CumplidoProveedor } from "./cambio-estado-cumplido.model";
import { TipoPago } from "./tipo_pago.model";

export class InformacionPago {
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

  constructor(
      Id: number = 0,
      TipoPagoId: TipoPago | null = null,
      CumplidoProveedorId: CumplidoProveedor | null = null,
      TipoDocumentoCobroId: number = 0,
      TipoCuentaBancariaId: number = 0,
      BancoId: number = 0,
      FechaInicial: Date = new Date('0001-01-01T00:00:00Z'),
      FechaFinal: Date = new Date('0001-01-01T00:00:00Z'),
      NumeroFactura: string = '',
      ValorCumplido: number = 0,
      NumeroCuenta: string = '',
      Activo: boolean = true,
      FechaCreacion: Date = new Date('0001-01-01T00:00:00Z'),
      FechaModificacion: Date = new Date('0001-01-01T00:00:00Z')
  ) {
      this.Id = Id;
      this.TipoPagoId = TipoPagoId;
      this.CumplidoProveedorId = CumplidoProveedorId;
      this.TipoDocumentoCobroId = TipoDocumentoCobroId;
      this.TipoCuentaBancariaId = TipoCuentaBancariaId;
      this.BancoId = BancoId;
      this.FechaInicial = FechaInicial;
      this.FechaFinal = FechaFinal;
      this.NumeroFactura = NumeroFactura;
      this.ValorCumplido = ValorCumplido;
      this.NumeroCuenta = NumeroCuenta;
      this.Activo = Activo;
      this.FechaCreacion = FechaCreacion;
      this.FechaModificacion = FechaModificacion;
  }
}