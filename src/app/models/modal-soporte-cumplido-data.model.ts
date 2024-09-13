export interface ModalSoportesCumplidoData {
  CumplidoProveedorId: number;
  Config: ConfigSoportes;
}

export interface ConfigSoportes {
  mode: Mode;
  rolUsuario: RolUsuario;
}

export enum Mode {
  CD = 'CargandoDocumentos',
  RC = 'RevisionContratacion',
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
