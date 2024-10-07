import { Banco } from "./banco.model";

export interface TipoCuentaBancaria {
    Id: number;
    Banco: Banco;
    Nombre: string;
    Descripcion: string | null;
    CodigoAbreviacion: string | null;
    Activo: boolean;
  }