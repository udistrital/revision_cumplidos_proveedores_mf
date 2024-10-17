import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemAEvaluar } from './../../../../models/item_a_evaluar';
import { PopUpManager } from 'src/app/managers/popUpManager';

@Component({
  selector: 'app-items-a-evaluar',
  templateUrl: './items-a-evaluar.component.html',
  styleUrls: ['./items-a-evaluar.component.scss'],
})
export class ItemsAEvaluarComponent {
  formAddIntems: FormGroup;
  numberId:number=0;

  constructor(private fb: FormBuilder, private popUpManager: PopUpManager) {
    this.formAddIntems = this.fb.group({
      detalles_item: [null, Validators.required],
    });
  }
  panelOpenState = false;

  listaItems: ItemAEvaluar[] = [];

  async imprimir() {
    if (this.obtenerInfoFormulario().item != '') {
      let confirm = await this.popUpManager.showConfirmAlert(
        '¿Estás seguro de agregar el ítem?'
      );
      if (confirm.isConfirmed) {
        this.listaItems.push({
          id: this.numberId+ 1,
          descripcion: this.obtenerInfoFormulario().item,
        });
        this.numberId= this.numberId+ 1
        this.formAddIntems.reset({
          detalles_item: '',
        });
      }
    }else{
      this.popUpManager.showErrorAlert("La descripción no puede estar vacía");
    }
  }

  obtenerInfoFormulario() {
    return {
      item: this.formAddIntems.get('detalles_item')?.getRawValue() ?? '',
    };
  }

  async eliminarItem(id:number) {
    let confirm = await this.popUpManager.showConfirmAlert(
      '¿Estás seguro de agregar el ítem?'
    );
    if(confirm){
      this.listaItems = this.listaItems.filter(item=>item.id!==id)
    }
   
  }
}
