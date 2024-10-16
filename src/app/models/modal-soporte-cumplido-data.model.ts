import { Button } from "./button.model";

export interface ModalSoportesCumplidoData {
  CumplidoProveedorId: number;
  Config: ConfigSoportes;
  Buttons:Button[]
  ModalButtonsFunc:Button[]
}

export interface ModalComentariosSoporteData{
  SoporteId: number;
  TipoSoporte: string;
  CumplidoProveedorId:number;
  Config: ConfigSoportes;
}

export interface ConfigSoportes {
  mode: Mode;
  rolUsuario: RolUsuario;
}

export enum Mode {
  CD = 'CargandoDocumentos',
  RC = 'RechazadoContratacion',
  PRC = 'PendienteRevisionContratacion',
  PRO = 'PendienteRevisionOrdenador',
  AO = 'AprobadoOrdenador',
  RO = 'RechazadoOrdenador',
}

export enum RolUsuario {
  S = 'Supervisor',
  C = 'Contratacion',
  O = 'Ordenador',
}

