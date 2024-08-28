import { Banco } from "./banco.model";

export class TipoCuentaBancaria {
    Id: number;
    Banco: Banco;
    Nombre: string;
    Descripcion: string | null;
    CodigoAbreviacion: string | null;
    Activo: boolean;
  
    constructor(
      Id: number,
      Banco: Banco,
      Nombre: string,
      Descripcion: string | null,
      CodigoAbreviacion: string | null,
      Activo: boolean
    ) {
      this.Id = Id;
      this.Banco = Banco;
      this.Nombre = Nombre;
      this.Descripcion = Descripcion;
      this.CodigoAbreviacion = CodigoAbreviacion;
      this.Activo = Activo;
    }
  }