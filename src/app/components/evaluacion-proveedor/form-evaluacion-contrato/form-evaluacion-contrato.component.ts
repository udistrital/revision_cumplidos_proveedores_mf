import { Component, OnInit } from '@angular/core';
import { Evaluacion } from 'src/app/models/evaluacion_cumplidos_proiveedores_crud/evaluacion';

import { EvaluacionCumplidosProveedoresCrudService } from 'src/app/services/evaluacion_cumplidos_provedores_crud.service';

@Component({
  selector: 'app-form-evaluacion-contrato',
  templateUrl: './form-evaluacion-contrato.component.html',
  styleUrls: ['./form-evaluacion-contrato.component.scss']
})
export class FormEvaluacionContratoComponent  implements OnInit{ 
  panelEvaluacion:boolean=false

  evaluacion!:Evaluacion|null


constructor(private evaluacionCumplidosCrud:EvaluacionCumplidosProveedoresCrudService){}

  async ngOnInit(): Promise<void> {
    try {
      this.evaluacion = await this.evaluacionCumplidosCrud.getEvaluacion();
      console.log(this.evaluacion);
      console.log(this.evaluacion);
    } catch (error) {
      console.error(error);
    }
  }


}
