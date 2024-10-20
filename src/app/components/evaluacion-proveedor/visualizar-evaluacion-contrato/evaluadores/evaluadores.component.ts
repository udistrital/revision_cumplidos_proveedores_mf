import { Component, signal, ChangeDetectionStrategy, Input } from '@angular/core';
import { Evaluador } from 'src/app/models/evaluador.model';

@Component({
  selector: 'app-evaluadores',
  templateUrl: './evaluadores.component.html',
  styleUrls: ['./evaluadores.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluadoresComponent {

  @Input({required:true})evaluadores!:Evaluador[]
  tittle!: string;
  readonly panelOpenState = signal(false);

  ngOnInit(){
    this.tittle = "Evaluadores"
  }
  
}
