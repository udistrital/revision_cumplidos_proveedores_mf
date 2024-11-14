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
  panelOpenStateItems = false;
  panelOpenStateEvaluadores = false;
  listaItems: ItemAEvaluar[] = [];


  constructor(private fb: FormBuilder, private popUpManager: PopUpManager) {
    this.formAddIntems = this.fb.group({
      
      id_item: [null, Validators.required],
      nombre_item: [null, Validators.required],
      cantidad_item: [null],
      valor_item: [null],
      iva_item: [null],
      unidad_item: [null, ],
      tipo_necesidad_item: [null],
      descripcion_item: [null, Validators.required],

    });
  }
 

  displayedColumns = [
    { def: 'id', header: 'Id' },
    { def: 'nombre', header: 'Nombre' },
    { def: 'descripcion', header: 'Descripcion' },
    { def: 'cantidad', header: 'Cantidad' },
    { def: 'valor', header: 'Valor' },
    { def: 'iva', header: 'Iva' },
    { def: 'tipoNecesidad', header: 'Tipo Necesidad' },
    { def: 'acciones', header: 'ACCIONES', isAction: true },
  ];

  async agregarItem() {
    console.log(this.formAddIntems.value)
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
      
          this.listaItems = [...this.listaItems, this.obtenerInfoFormulario()];
          this.formAddIntems.reset({
            descripcion_item: '',
          });
        } else {
          this.popUpManager.showErrorAlert('Verifica los campos');
        }
      }
    }
  }
  obtenerInfoFormulario() {
    console.log("casxcadsas")
    console.log(this.formAddIntems.get('cantidad_item')?.getRawValue() ?? '',)
    return {
      id: this.formAddIntems.get('id_item')?.getRawValue() ?? '',
      nombre: this.formAddIntems.get('nombre_item')?.getRawValue() ?? '',
      descripcion: this.formAddIntems.get('descripcion_item')?.getRawValue() ?? '',
      cantidad: this.formAddIntems.get('cantidad_item')?.getRawValue() ?? '',
      valor: this.formAddIntems.get('valor_item')?.getRawValue() ?? '',
      iva: this.formAddIntems.get('iva_item')?.getRawValue() ?? '',
      tipoNecesidad: this.formAddIntems.get('tipo_necesidad_item')?.getRawValue() ?? '',
      acciones: [{ icon: 'delete', actionName: 'delete', isActive: true }],
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

  handleActionClick(event: { action: any; element: any }) {
    console.log(event.element.id)
    if (event.action.actionName === 'delete') {
      this.eliminarItem(event.element.id);
    }
  }

}
