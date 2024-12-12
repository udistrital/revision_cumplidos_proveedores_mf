import { Component, signal, ChangeDetectionStrategy, Input } from '@angular/core';
import { Evaluador } from 'src/app/models/evaluador.model';

@Component({
  selector: 'app-visualizar-evaluadores',
  templateUrl: './visualizar-evaluadores.component.html',
  styleUrls: ['./visualizar-evaluadores.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisualizarEvaluadoresComponent {

  @Input({required:true})evaluadores!:Evaluador[]
  tittle!: string;
  readonly panelOpenState = signal(false);

  ngOnInit(){
    this.tittle = "Evaluadores"
  }

}
