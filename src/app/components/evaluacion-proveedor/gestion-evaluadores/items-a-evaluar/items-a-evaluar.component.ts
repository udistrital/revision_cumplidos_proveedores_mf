import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemAEvaluar } from './../../../../models/item_a_evaluar';

@Component({
  selector: 'app-items-a-evaluar',
  templateUrl: './items-a-evaluar.component.html',
  styleUrls: ['./items-a-evaluar.component.scss'],
})
export class ItemsAEvaluarComponent {
  formAddIntems: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formAddIntems = this.fb.group({
      detalles_item: [null, Validators.required],
    });
  }
  panelOpenState = false;

  listaItems: ItemAEvaluar[] = [];

  imprimir() {

    this.listaItems.push({
      id: this.listaItems.length + 1,
      descripcion: this.obtenerInfoFormulario().item,
    });
    this.formAddIntems.reset();

  }

  obtenerInfoFormulario() {
    return {
      item: this.formAddIntems.get('detalles_item')?.getRawValue() ?? '',
    };
  }
}
