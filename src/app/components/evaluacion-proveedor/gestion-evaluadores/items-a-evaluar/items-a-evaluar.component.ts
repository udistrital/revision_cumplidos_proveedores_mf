import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemAEvaluar } from '../../../../models/item_a_evaluar';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { ModalComentariosSoporteComponent } from 'src/app/components/general-components/modal-comentarios-soporte/modal-comentarios-soporte.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalComentariosSoporteData } from 'src/app/models/modal-soporte-cumplido-data.model';
import { ModalCargarItemsComponent } from '../modal-cargar-items/modal-cargar-items.component';
import { UnidadMedida } from 'src/app/models/unidad-medida';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-items-a-evaluar',
  templateUrl: './items-a-evaluar.component.html',
  styleUrls: ['./items-a-evaluar.component.scss'],
})
export class ItemsAEvaluarComponent implements OnInit {
  formAddIntems: FormGroup;
  formularioEnviado: boolean = false;
  panelOpenStateItems = false;
  panelOpenStateEvaluadores = false;
  listaItems: ItemAEvaluar[] = [];
  listaUnidades: UnidadMedida[] = [];
  listaTipoNecesidad:any[]=[]
  @Output() listaItemsEmiter = new EventEmitter<any>();
  async ngOnInit() {
    this.listaUnidades = await this.utilsService.obtenerMedidas();
  }
  constructor(
    private fb: FormBuilder,
    private popUpManager: PopUpManager,
    private dialog: MatDialog,
    private utilsService: UtilsService
  ) {
    this.formAddIntems = this.fb.group({
      id_item: [null, Validators.required],
      nombre_item: [null, Validators.required],
      cantidad_item: [null],
      valor_item: [null],
      iva_item: [null],
      unidad_item: [null],
      tipo_necesidad_item: [null],
      descripcion_item: [null, Validators.required],
    });
    this.listaTipoNecesidad=this.obtenerTipioNecesidad();
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
    console.log(this.formAddIntems.value);
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
          this.listaItemsEmiter.emit(this.listaItems);
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
    return {
      id: this.formAddIntems.get('id_item')?.getRawValue() ?? '',
      nombre: this.formAddIntems.get('nombre_item')?.getRawValue() ?? '',
      descripcion:
        this.formAddIntems.get('descripcion_item')?.getRawValue() ?? '',
      cantidad: this.formAddIntems.get('cantidad_item')?.getRawValue() ?? '',
      valor: this.formAddIntems.get('valor_item')?.getRawValue() ?? '',
      iva: this.formAddIntems.get('iva_item')?.getRawValue() ?? '',
      tipoNecesidad:
        this.formAddIntems.get('tipo_necesidad_item')?.getRawValue() ?? '',
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
    console.log(event.element.id);
    if (event.action.actionName === 'delete') {
      this.eliminarItem(event.element.id);
    }
  }

  openDialogCargarExcel() {
    this.dialog.open(ModalCargarItemsComponent, {
      disableClose: true,
      maxHeight: '80vh',
      maxWidth: '60vw',
      minHeight: '80v',
      minWidth: '60vw',
      height: 'auto',
      width: 'auto',
      data: {},
    });
  }

  obtenerTipioNecesidad(): any[] {
    return [
      { Tipo: 'BIEN', Id: 1 },
      { Tipo: 'SERVICIO', Id: 2 },
      { Tipo: 'BIENES Y SERVICIOS', Id: 3 },
    ];
  }
}
