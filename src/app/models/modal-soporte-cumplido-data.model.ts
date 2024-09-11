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
  RO = 'RevisionOrdenador',
}

export enum RolUsuario {
  S = 'Supervisor',
  C = 'Contratacion',
  O = 'Ordenador',
}
