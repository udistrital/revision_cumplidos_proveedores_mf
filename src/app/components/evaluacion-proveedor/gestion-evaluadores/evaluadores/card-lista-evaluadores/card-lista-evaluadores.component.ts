import { Component, Input, SimpleChanges } from '@angular/core';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { Item } from 'src/app/models/evaluacion_cumplido_prov_crud/item.model';
import { Evaluador } from 'src/app/models/evaluador';

@Component({
  selector: 'app-card-lista-evaluadores',
  templateUrl: './card-lista-evaluadores.component.html',
  styleUrls: ['./card-lista-evaluadores.component.scss']
})
export class CardListaEvaluadoresComponent {
  constructor(private popUpManager: PopUpManager) {}

  @Input() listaEvaluadores: Evaluador[] = [];
  @Input() eliminarItem!: (id: number) => Promise<void>;






  getItemsAEvaluar(items: Item[]): string {
    return items.map(item => item.Identificador).join(",").trim();
  }


  async ejecutarEliminarItem(id: number) {
    if (this.eliminarItem) {
      await this.eliminarItem(id);
    }
  }


}
