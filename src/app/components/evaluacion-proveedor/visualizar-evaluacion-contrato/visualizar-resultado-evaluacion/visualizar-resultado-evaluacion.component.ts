import { Component, Input, signal } from '@angular/core';
import { Resultado } from 'src/app/models/evaluacion_cumplido_prov_mid/informacion-evaluacion.model';

@Component({
  selector: 'app-visualizar-resultado-evaluacion',
  templateUrl: './visualizar-resultado-evaluacion.component.html',
  styleUrls: ['./visualizar-resultado-evaluacion.component.scss']
})
export class VisualizarResultadoEvaluacionComponent {
  tittle!: string;
  readonly panelOpenState = signal(false);
  @Input({required: true}) resultadoEvaluacion!: Resultado;
  @Input({required: true}) puntajeTotal!: number;
  @Input({required: true}) clasificacion!: string;

  ngOnInit(){
    this.tittle = "Resultado Evaluación";
  }
}
