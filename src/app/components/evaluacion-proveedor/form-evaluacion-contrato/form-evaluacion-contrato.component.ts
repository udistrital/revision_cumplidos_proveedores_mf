import { Component, OnInit } from '@angular/core';
import { Evaluacion } from 'src/app/models/evaluacion_cumplidos_proiveedores_crud/evaluacion';
import { EvaluacionCumplidoProvCrudService } from 'src/app/services/evaluacion_cumplido_prov_crud';

@Component({
  selector: 'app-form-evaluacion-contrato',
  templateUrl: './form-evaluacion-contrato.component.html',
  styleUrls: ['./form-evaluacion-contrato.component.scss']
})
export class FormEvaluacionContratoComponent  implements OnInit{ 
  panelEvaluacion:boolean=false

  evaluacion!:Evaluacion|null


constructor(private evaluacionCumplidosCrud:EvaluacionCumplidoProvCrudService){}

  async ngOnInit(): Promise<void> {
    try {
      this.evaluacion = await this.evaluacionCumplidosCrud.getEvaluacion();
    } catch (error) {
      console.error(error);
    }
  }


}
