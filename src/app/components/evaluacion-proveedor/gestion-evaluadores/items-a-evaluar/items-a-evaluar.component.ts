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
  formularioEnviado: boolean = false;

  constructor(private fb: FormBuilder, private popUpManager: PopUpManager) {
    this.formAddIntems = this.fb.group({
      detalles_item: [null, Validators.required],
      id_item: [null, Validators.required],
      nombre_item: [null, Validators.required],
    });
  }
  panelOpenStateItems = false;
  panelOpenStateEvaluadores = false;

  listaItems: ItemAEvaluar[] = [];

  async agregarItem() {
    const existe = this.listaItems.some(
      (item) => item.id === this.obtenerInfoFormulario().id
    );

    if (existe) {
      this.popUpManager.showErrorAlert('El id ya existe');
    } else {
      let confirm = await this.popUpManager.showConfirmAlert(
        '¿Estás seguro de agregar el ítem?'
      );
      if (confirm.isConfirmed) {
        if (this.validarFromulario()) {
          this.formularioEnviado = false;
          const nuevoItem = {
            id: this.obtenerInfoFormulario().id,
            nombre: this.obtenerInfoFormulario().nombre,
            descripcion: this.obtenerInfoFormulario().detalles,
          };
          this.listaItems = [...this.listaItems, nuevoItem];
          this.formAddIntems.reset({
            detalles_item: '',
          });
        } else {
          this.popUpManager.showErrorAlert('Verifica los campos');
        }
      }
    }
  }

  obtenerInfoFormulario() {
    return {
      id: this.formAddIntems.get('id_item')?.getRawValue() ?? '',
      nombre: this.formAddIntems.get('nombre_item')?.getRawValue() ?? '',
      detalles: this.formAddIntems.get('detalles_item')?.getRawValue() ?? '',
    };
  }

  async eliminarItem(id: number) {
    let confirm = await this.popUpManager.showConfirmAlert(
      '¿Estás seguro de eliminar el ítem?'
    );
    if (confirm.isConfirmed) {
      this.listaItems = this.listaItems.filter((item) => item.id !== id);
    }
  }

  validarFromulario(): boolean {
    let isValid = true;

    const controls = this.formAddIntems.controls;
    for (const control in controls) {
      if (controls[control].invalid) {
        controls[control].markAsTouched();
        isValid = false;
        this.formularioEnviado = true;
      }
    }

    return isValid;
  }
}
