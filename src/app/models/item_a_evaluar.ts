export interface ItemAEvaluar {
    Id?: number | null;
    EvaluacionId:{
        Id:number;
    };
    Nombre:string;
    Identificador:string
    FichaTecnica: string;
    Cantidad:number
    ValorUnitario:number
    Iva:number
    TipoNecesidad:number
    Activo?:boolean | null;
    acciones:any

    
}

