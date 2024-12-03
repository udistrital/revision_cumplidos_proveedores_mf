import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { Evaluador } from 'src/app/models/evaluador';
import { UnidadMedida } from 'src/app/models/unidad-medida';
import { UtilsService } from 'src/app/services/utils.service';
import { ItemAEvaluar } from './../../../../models/item_a_evaluar';
import { EvaluacionCumplidoProvCrudService } from 'src/app/services/evaluacion_cumplido_prov_crud';
import { AsignacionEvaluador, AsignacionEvaluadorBody } from './../../../../models/evaluacion_cumplido_prov_crud/asignacion_evaluador.model';
import { Item } from './../../../../models/evaluacion_cumplido_prov_crud/item.model'

@Component({
  selector: 'app-evaluadores',
  templateUrl: './evaluadores.component.html',
  styleUrls: ['./evaluadores.component.scss'],
})
export class EvaluadoresComponent  {
  panelOpenStateItems = true;
  listaEvaluadores: Evaluador[] = [];
  formAddEvaluadores: FormGroup;
  asignacionEvaluador: AsignacionEvaluador[] = [];
  formularioEnviado: boolean = false;
  evaluador!: AsignacionEvaluador;
  @Input() listaItems:ItemAEvaluar[]=[]
  @Output() porcentaje = new EventEmitter<number>();

  constructor(
    private fb: FormBuilder,
    private popUpManager: PopUpManager,
    private utilsService:UtilsService,
    private cdr: ChangeDetectorRef,
    private evaluacionCumplidoProvCrudService: EvaluacionCumplidoProvCrudService
  ) {
    this.guardarEvaluadores();
    this.formAddEvaluadores = this.fb.group({
      numero_documento: ['', [Validators.required]],
      cargo: ['', [Validators.required]],
      item_a_evaluar: [[], [Validators.required]],
      porcentaje: ['', [Validators.required]],
    });
  }
  ngOnChanges(changes: SimpleChanges) {

    console.log(this.listaItems);
  }




  handleActionClick(event: { action: any; element: any }) {
    if (event.action.actionName === 'delete') {
      this.eliminarEvaluador(event.element.NumeroDocumento);
    }
  }

  async agregarEvaluador() {
    console.log(this.obtenerInfoFormulario())
    if (this.validarFromulario()) {
      const existe = this.listaEvaluadores.some(
        (item) =>
          item.NumeroDocumento === this.obtenerInfoFormulario().NumeroDocumento
      );

      if (existe) {
        this.popUpManager.showErrorAlert('El Documento ya existe');
      } else {
        let confirm = await this.popUpManager.showConfirmAlert(
          '¿Estás seguro de agregar el ítem?'
        );
        if (confirm.isConfirmed) {
          if (
            this.sumarPorcentaje() +
              Number(this.obtenerInfoFormulario().PorcentajeDeEvaluacion) >
            100
          ) {
            this.popUpManager.showErrorAlert(
              'La suma de porcentajes no puede superar el 100%'
            );
          } else {
            this.formularioEnviado = true;
            this.listaEvaluadores = [
              ...this.listaEvaluadores,
              this.obtenerInfoFormulario(),
            ];
            this.porcentaje.emit(this.sumarPorcentaje());
            this.formAddEvaluadores.reset();
            this.formularioEnviado = false;
          }
        }
      }
    } else {
      this.popUpManager.showErrorAlert('Verifica los campos');
    }
  }

  guardarEvaluadorIndividual = async (data: AsignacionEvaluadorBody): Promise<void> => {
    try{
      const { ItemsAEvaluar, ...dataSinItems } = data;
      const response = await this.evaluacionCumplidoProvCrudService.post('/asignacion_evaluador', dataSinItems).toPromise();

      const responseData = response as any;
      if (responseData && responseData.Data){
        this.evaluador = {
          Id: responseData.Data.Id,
          PersonaId: responseData.Data.PersonaId,
          EvaluacionId: responseData.Data.EvaluacionId.Id,
          Cargo: responseData.Data.Cargo,
          PorcentajeEvaluacion: responseData.Data.PorcentajeEvaluacion
        }
      }
      console.log("Respuesta del servidor:", response);
    } catch(error:any) {
      console.log(`Error: ${error.response?.data?.message || error.message}`)
    }
  };


  async guardarEvaluadores() {
    // const datosPrueba: AsignacionEvaluadorBody[] = this.listaEvaluadores.map((evaluador) => {
    //   return {
    //     PersonaId: evaluador.NumeroDocumento,
    //     EvaluacionId: { Id: 1 },
    //     Cargo: evaluador.Cargo,
    //     PorcentajeEvaluacion: evaluador.PorcentajeDeEvaluacion,
    //   };
    // })
    const datosPrueba: AsignacionEvaluadorBody[] = [
      { PersonaId: 12345678, 
        EvaluacionId: { Id: 1 }, 
        Cargo: 'Cargo', 
        PorcentajeEvaluacion: 0.25, 
        ItemsAEvaluar: [
          {
            Id: 1,
            EvaluacionId: {
                Id: 1
            },
            Identificador: "item1",
            Nombre: "ELABORACIÓN DE LIBRETOS ",
            ValorUnitario: 5000,
            Iva: 12,
            FichaTecnica: "ELABORACIÓN DE LIBRETOS DURANTE LA VIGENCIA DEL 2024.",
            Unidad: 1,
            Cantidad: 13,
            TipoNecesidad: 2
          },
          {
            Id: 2,
            EvaluacionId: {
                Id: 1
            },
            Identificador: "item1",
            Nombre: "ELABORACIÓN DE LIBRETOS ",
            ValorUnitario: 5000,
            Iva: 12,
            FichaTecnica: "ELABORACIÓN DE LIBRETOS DURANTE LA VIGENCIA DEL 2024.",
            Unidad: 1,
            Cantidad: 13,
            TipoNecesidad: 2
          },
          {
            Id: 3,
            EvaluacionId: {
                Id: 1
            },
            Identificador: "item1",
            Nombre: "ELABORACIÓN DE LIBRETOS ",
            ValorUnitario: 5000,
            Iva: 12,
            FichaTecnica: "ELABORACIÓN DE LIBRETOS DURANTE LA VIGENCIA DEL 2024.",
            Unidad: 1,
            Cantidad: 13,
            TipoNecesidad: 2
          },
        ] 
      },
    ];

    const resultados = await Promise.allSettled(
      datosPrueba.map(async (data) => {
        
        await this.guardarEvaluadorIndividual(data);
        await this.guardarItemsEvaluador(this.evaluador.Id, data.ItemsAEvaluar);
      })
    );

    resultados.forEach((resultado, index) => {
      if (resultado.status === "fulfilled") {
        console.log(`Solicitud ${index + 1} completada con éxito.`);
      } else {
        console.error(`Solicitud ${index + 1} falló:`, resultado.reason);
      }
    });
};

async guardarItemsEvaluador(asignacionEvaluadorId: number, ItemsAEvaluar: Item[]){
  let existe: boolean = false;
  if (ItemsAEvaluar.length > 0){
    this.evaluacionCumplidoProvCrudService
    .get(`/asignacion_evaluador_item/?query=AsignacionEvaluadorId.Id:${asignacionEvaluadorId},Activo:true&limit=-1`)
    .subscribe({
      next: (res: any) => {
        if (res.Data[0].Id !== undefined){
          for(let i = 0; i < res.Data.length; i++){
            existe = this.itemInLista(res.Data[i].ItemId.Id, ItemsAEvaluar);
            if (!existe){
              this.evaluacionCumplidoProvCrudService
              .delete("/asignacion_evaluador_item", res.Data[i].Id)
              .subscribe({
                
              })
            }
          }
        }
  
        for(let i = 0; i < ItemsAEvaluar.length; i++){
          this.evaluacionCumplidoProvCrudService
          .post("/asignacion_evaluador_item", {
            AsignacionEvaluadorId: { Id: asignacionEvaluadorId },
            ItemId: { Id: ItemsAEvaluar[i].Id }
          }).subscribe({
            
          })

        }
      },
      error: (error: any) => {
        this.popUpManager.showErrorAlert('No fue posible asignar los items al evaluador')
        console.error(error);
      },
    });
  }
}


itemInLista(idItem: number, ItemsAEvaluar: Item[]): boolean{
  for( let i = 0; i < ItemsAEvaluar.length; i++){
    if(ItemsAEvaluar[i].Id == idItem){
      return true;
    }
  }
  return false;
}


  async eliminarEvaluador(numeroDocumento: number) {
    let confirm = await this.popUpManager.showConfirmAlert(
      '¿Estás seguro de eliminar el Evaluador?'
    );
    if (confirm.isConfirmed) {
      this.listaEvaluadores = this.listaEvaluadores.filter(
        (item) => item.NumeroDocumento !== numeroDocumento
      );
    }

  }

  obtenerInfoFormulario() {
    let nuevoEvaludor: Evaluador = {
      NumeroDocumento:
        this.formAddEvaluadores.get('numero_documento')?.getRawValue() ?? '',
      Cargo: this.formAddEvaluadores.get('cargo')?.getRawValue() ?? '',
      ItemAEvaluar: this.formAddEvaluadores.get('item_a_evaluar')?.getRawValue() ?? [],
      PorcentajeDeEvaluacion:
        this.formAddEvaluadores.get('porcentaje')?.getRawValue() ?? '',
      acciones: [{ icon: 'delete', actionName: 'delete', isActive: true }],
    };
    return nuevoEvaludor;
  }

  validarFromulario(): boolean {
    let isValid = true;

    const controls = this.formAddEvaluadores.controls;
    for (const control in controls) {
      if (controls[control].invalid) {
        controls[control].markAsTouched();
        isValid = false;
        this.formularioEnviado = true;
      }
    }

    return isValid;
  }

  validarNumero(nombre: any, value: any): void {
    const control = this.formAddEvaluadores.get(nombre);

    if (control) {
      if (/[a-zA-Z]/.test(value.data)) {
        control.setValue(control.value.replace(/[^0-9]/g, ''));
      }
    }
  }

  sumarPorcentaje() {
    let suma = 0;
    this.listaEvaluadores.forEach((evaluador) => {
      suma += Number(evaluador.PorcentajeDeEvaluacion);
    });
    return suma;
  }

  async eliminarItem(id: number) {

    let confirm = await this.popUpManager.showConfirmAlert(
      '¿Estás seguro de eliminar el Evaluador?'
    );
    if (confirm.isConfirmed) {
      this.listaEvaluadores = this.listaEvaluadores.filter((evaluador) => evaluador.NumeroDocumento !== id);
    }
    this.porcentaje.emit(this.sumarPorcentaje());
  }
}
