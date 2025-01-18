export interface SupervisorContrato {
  contratos: Contratos;
}

export interface Supervisor {
  documento: string;
  cargo: string;
  nombre: string;
}

export interface Contratos {
  supervisor: Supervisor[];
}

