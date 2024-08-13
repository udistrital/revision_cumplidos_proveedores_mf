export class Cumplido {
  cdp: string;
  dependencia: string;
  documentoOrdenador: string;

  nombreOrdenador: string;

  nombreProveedor: string;
  numeroContrato: string;
  rp: string;
  tipoContrato: string;
  vigencia: number;

  constructor(
    cdp: string,
    dependencia: string,
    documentoOrdenador: string,
    nombreOrdenador: string,
    nombreProveedor: string,
    numeroContrato: string,
    rp: string,
    tipoContrato: string,
    vigencia: number
  ) {
    this.cdp = cdp;
    this.dependencia = dependencia;
    this.documentoOrdenador = documentoOrdenador;
    this.nombreOrdenador = nombreOrdenador;
    this.nombreProveedor = nombreProveedor;
    this.numeroContrato = numeroContrato;
    this.rp = rp;
    this.tipoContrato = tipoContrato;
    this.vigencia = vigencia;
  }
}
