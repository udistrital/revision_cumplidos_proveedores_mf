export class Banco {
    Id: number;
    NombreBanco: string;
    DenominacionBanco: string;
    Descripcion: string;
    Nit: string;
    CodigoSuperintendencia: number;
    CodigoAch: number;
    EstadoActivo: boolean;
  
    constructor(
      Id: number,
      NombreBanco: string,
      DenominacionBanco: string,
      Descripcion: string,
      Nit: string,
      CodigoSuperintendencia: number,
      CodigoAch: number,
      EstadoActivo: boolean
    ) {
      this.Id = Id;
      this.NombreBanco = NombreBanco;
      this.DenominacionBanco = DenominacionBanco;
      this.Descripcion = Descripcion;
      this.Nit = Nit;
      this.CodigoSuperintendencia = CodigoSuperintendencia;
      this.CodigoAch = CodigoAch;
      this.EstadoActivo = EstadoActivo;
    }
  }