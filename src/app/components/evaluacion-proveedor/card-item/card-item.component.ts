import { ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { ItemAEvaluar } from 'src/app/models/item_a_evaluar';

@Component({
  selector: 'app-card-item',
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.scss'],
})
export class CardItemComponent {
  constructor(private popUpManager: PopUpManager) {}

  @Input() listaItems: ItemAEvaluar[] = [];
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
