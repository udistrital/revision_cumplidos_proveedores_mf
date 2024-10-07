export interface ContratoSupervisor {
  NombreSupervisor: string
  Dependencias_supervisor: Dependencia[]
	Contratos:               InformacionContratoProveedor[]
}

export interface Dependencia {
	Codigo: string
	Nombre: string
}

export interface InformacionContratoProveedor {
	TipoContrato:           string
	NumeroContratoSuscrito: string
	Vigencia:               string
	NumeroRp:               string
	VigenciaRp:             string
	NombreProveedor:        string
	NombreDependencia:      string
	NumDocumentoSupervisor: string
	NumeroCdp:              string
	VigenciaCdp:            string
	Rubro:                  string
}
