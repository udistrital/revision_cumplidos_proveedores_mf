import { Component, Input, SimpleChanges } from '@angular/core';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { Evaluador } from 'src/app/models/evaluador';
import { ItemAEvaluar } from 'src/app/models/item_a_evaluar';

@Component({
  selector: 'app-card-lista-evaluadores',
  templateUrl: './card-lista-evaluadores.component.html',
  styleUrls: ['./card-lista-evaluadores.component.scss']
})
export class CardListaEvaluadoresComponent {
  constructor(private popUpManager: PopUpManager) {}

  @Input() listaEvaluadores: Evaluador[] = [];
  @Input() eliminarItem!: (id: number) => Promise<void>;
 

  ngOnChanges(changes: SimpleChanges) {
    if (changes["listaItems"]) {
    }
}


  async ejecutarEliminarItem(id: number) {
    if (this.eliminarItem) {
      await this.eliminarItem(id);
    }
  }
 
  
}
