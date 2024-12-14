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
import { EvaluacionCumplidoProvCrudService } from 'src/app/services/evaluacion_cumplido_prov_crud';
import { Evaluacion } from 'src/app/models/evaluacion_cumplidos_proiveedores_crud/evaluacion';

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
  evaluacion: Evaluacion | null = null;
  @Output() listaItemsEmiter = new EventEmitter<any>();
  async ngOnInit() {
    this.listaUnidades = await this.utilsService.obtenerMedidas();
    this.evaluacion = await this.evaluacionnCymplidosCrud.getEvaluacion();
    await this.consulatarItems();


  }
  constructor(
    private fb: FormBuilder,
    private popUpManager: PopUpManager,
    private dialog: MatDialog,
    private utilsService: UtilsService,
    private evaluacionnCymplidosCrud: EvaluacionCumplidoProvCrudService
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
    { def: 'Identificador', header: 'Id' },
    { def: 'Nombre', header: 'Nombre' },
    { def: 'FichaTecnica', header: 'Descripcion' },
    { def: 'Cantidad', header: 'Cantidad' },
    { def: 'ValorUnitario', header: 'Valor' },
    { def: 'Iva', header: 'Iva' },
    { def: 'TipoNecesidad', header: 'Tipo Necesidad' },
    { def: 'acciones', header: 'ACCIONES', isAction: true },
  ];

  async agregarItem() {
    console.log(this.formAddIntems.value);
    const existe = this.listaItems.some(
      (item) => item.Identificador === this.obtenerInfoFormulario().Identificador
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
  obtenerInfoFormulario():ItemAEvaluar {
    
    console.log('evaaaaluacion idddddd ', this.evaluacion?.Id);
    return {
      Identificador: this.formAddIntems.get('id_item')?.getRawValue() ?? '',
      Nombre: this.formAddIntems.get('nombre_item')?.getRawValue() ?? '',
      FichaTecnica:
        this.formAddIntems.get('descripcion_item')?.getRawValue() ?? '',
        Cantidad: Number(this.formAddIntems.get('cantidad_item')?.getRawValue() ?? ''),
        ValorUnitario: Number(this.formAddIntems.get('valor_item')?.getRawValue() ?? ''),
        Iva: Number(this.formAddIntems.get('iva_item')?.getRawValue() ?? ''),
        TipoNecesidad:
        this.formAddIntems.get('tipo_necesidad_item')?.getRawValue() ?? '',
        EvaluacionId:{
        Id:this.evaluacion?.Id ?? 0
      },
      acciones: [{ icon: 'delete', actionName: 'delete', isActive: true }],
    };
  }

  async eliminarItem(identificador: string) {
    let confirm = await this.popUpManager.showConfirmAlert(
      '¿Estás seguro de eliminar el ítem?'
    );
    if (confirm.isConfirmed) {
      this.listaItems = this.listaItems.filter((item) => item.Identificador !== identificador);
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
      this.eliminarItem(event.element.Identificador);
    }
  }

  openDialogCargarExcel() {
    const dialogRef =  this.dialog.open(ModalCargarItemsComponent, {
      disableClose: true,
      maxHeight: '80vh',
      maxWidth: '60vw',
      minHeight: '80v',
      minWidth: '60vw',
      height: 'auto',
      width: 'auto',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.listaItems = [...this.listaItems, ...result.listaitemsCargados];
    });
  }

  obtenerTipioNecesidad(): any[] {
    return [
      { Tipo: 'BIEN', Id: 1 },
      { Tipo: 'SERVICIO', Id: 2 },
      { Tipo: 'BIENES Y SERVICIOS', Id: 3 },
    ];
  }


  async guardarItems(){

    if (this.listaItems.length <0) {
      this.popUpManager.showErrorAlert('No hay elementos agregados a la lista');
    } else {
      let confirm = await this.popUpManager.showConfirmAlert(
        '¿Estás seguro de guardar el ítem?'
      );
      if (confirm.isConfirmed) {
       
         
          try{
              this.evaluacionnCymplidosCrud.post("/item/guardado_multiple", this.listaItems).subscribe({ 
                next: (res: any) => {
                  this.popUpManager.showSuccessAlert('Items guardados correctamente');
                  this.listaItemsEmiter.emit(this.listaItems);
                }

              })
          }catch(error){
            console.error(error);}

      
      }
    }
  }

  async consulatarItems(){

    this.evaluacionnCymplidosCrud.get("/item?query=EvaluacionId:"+this.evaluacion?.Id+"&limit=-1").subscribe({
      next: (res: any) => {
        this.listaItems = res.Data.map((item: any) => {
          return {
            Id: item.Id,
            Identificador: item.Identificador,
            Nombre: item.Nombre,
            FichaTecnica: item.FichaTecnica,
            Cantidad: item.Cantidad,
            ValorUnitario: item.ValorUnitario,
            Iva: item.Iva,
            TipoNecesidad: item.TipoNecesidad,
            EvaluacionId: item.EvaluacionId,
            acciones: [{ icon: 'delete', actionName: 'delete', isActive: true }],
          };
        });
        this.listaItemsEmiter.emit(this.listaItems);
      },
      error: (error: any) => {
        this.popUpManager.showErrorAlert('Error al consultar los items');
      },
    });
  }


}
