import { Component } from '@angular/core';
import { Evaluador } from 'src/app/models/evaluador.model';
import { ItemAEvaluar } from 'src/app/models/item_a_evaluar';
import { EvaluacionCumplidoProvCrudService } from './../../../services/evaluacion_cumplido_prov_crud';
import { Evaluacion } from 'src/app/models/evaluacion_cumplidos_proiveedores_crud/evaluacion';

@Component({
  selector: 'app-visualizar-evaluacion-contrato',
  templateUrl: './visualizar-evaluacion-contrato.component.html',
  styleUrls: ['./visualizar-evaluacion-contrato.component.scss']
})
export class VisualizarEvaluacionContratoComponent {

  tittle!: string;
  listaItems!: string[];
  listaObservaciones!: string[];
  listaEvaluaciones!: Evaluador[];
  listaItemsEvaluar!: ItemAEvaluar[];
  evaluacion!:Evaluacion|null

  constructor(private evaluacionCumplidosCrud:EvaluacionCumplidoProvCrudService) { }

  async ngOnInit(){
    this.evaluacion = await this.evaluacionCumplidosCrud.getEvaluacion();
    console.log("FormEvaluacionContratoComponent",this.evaluacion);
 
    this.tittle = 'Ver Evaluación';
  
    this.listaItems = [
      "Televisores",
      "Mejoras al sistema de servidores",
      "Comida de gato",
      "Atún"
    ];

    this.listaObservaciones = [
      "Completo todo, satisfactoriamente",
      "Ha logrado los objetivos",
      "Maravillosos equipos"
    ];

    this.listaEvaluaciones = [
      {
        numeroCedula: "1014199894",
        cargo: "Supervisor",
        itemsEvaluados: ["1", "2", "3", "4", "5", "6", "7", "8", "8"],
        evaluacionDada: 86
      },
      {
        numeroCedula: "80101476",
        cargo: "Supervisor",
        itemsEvaluados: ["2", "3", "55", "7", "8", "84", "9", "6", "3"],
        evaluacionDada: 90
      }
    ]


  }

  calcularPromedioEvaluaciones(evaluaciones: Evaluador[]): number{
    let suma = 0;
    for (let evaluacion of evaluaciones){
      suma += evaluacion.evaluacionDada;
    }
    return suma/evaluaciones.length;
  }

  calcularPonderadoEvaluacion(value: number){
    if (value >= 80){
      return 'Excelente';
    } else if (value > 46 && value < 80){
      return 'Bueno';
    } else {
      return 'Malo';
    }
  }
}
