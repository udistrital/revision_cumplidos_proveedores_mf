import { Acciones } from "./acciones.model";

export interface Cumplido {
    NumeroContrato: string;
    Vigencia: string;
    Rp: string;
    Mes: number;
    FechaCambioEstado: string;
    NombreProveedor: string;
    Dependencia: string;
    Estado: string;
    TipoContrato: string;
    acciones?: Acciones[];
    IdCumplido:number;
    InformacionPago?:string
  }
