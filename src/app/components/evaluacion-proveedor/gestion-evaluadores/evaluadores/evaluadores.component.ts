import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { Evaluador } from 'src/app/models/evaluador';
import { UnidadMedida } from 'src/app/models/unidad-medida';
import { UtilsService } from 'src/app/services/utils.service';
import { ItemAEvaluar } from './../../../../models/item_a_evaluar';
import { EvaluacionCumplidoProvCrudService } from 'src/app/services/evaluacion_cumplido_prov_crud';
import { Item } from './../../../../models/evaluacion_cumplido_prov_crud/item.model';
import { JbpmService } from './../../../../services/jbpm_service.service';
import { PersonaNatural } from 'src/app/models/persona-natural';
import { Evaluacion } from 'src/app/models/evaluacion_cumplidos_proiveedores_crud/evaluacion';
import {
  AsignacionEvaluador,
  AsignacionEvaluadorBody,
} from 'src/app/models/evaluacion_cumplido_prov_crud/asignacion_evaluador.model';
import { map } from 'rxjs';
import { RolAsignacionEvaluador } from 'src/app/models/evaluacion_cumplidos_proiveedores_crud/rol_asignacion_evaluador';

@Component({
  selector: 'app-evaluadores',
  templateUrl: './evaluadores.component.html',
  styleUrls: ['./evaluadores.component.scss'],
})
export class EvaluadoresComponent implements OnInit {
  panelOpenStateItems = true;
  listaEvaluadores: Evaluador[] = [];
  formAddEvaluadores: FormGroup;
  asignacionEvaluador: AsignacionEvaluadorBody[] = [];
  formularioEnviado: boolean = false;
  asignacion!: AsignacionEvaluador;
  rolAsignacion: RolAsignacionEvaluador[] = [];
  @Input() listaItems: ItemAEvaluar[] = [];
  @Output() porcentaje = new EventEmitter<number>();
  evaluadres: PersonaNatural[] = [];
  evaluacion!: Evaluacion | null;
  constructor(
    private fb: FormBuilder,
    private popUpManager: PopUpManager,
    private utilsService: UtilsService,
    private cdr: ChangeDetectorRef,
    private evaluacionCumplidoProvCrudService: EvaluacionCumplidoProvCrudService,
    private jbpmService: JbpmService
  ) {
    this.formAddEvaluadores = this.fb.group({
      numero_documento: ['', [Validators.required]],
      cargo: ['', [Validators.required]],
      item_a_evaluar: [[], [Validators.required]],
      porcentaje: ['', [Validators.required]],
    });
  }

  async ngOnInit() {
    this.evaluacion =
      await this.evaluacionCumplidoProvCrudService.getEvaluacion();
    await this.obterEvaluadores(this.evaluacion?.Id ?? 0);
  }
  ngOnChanges(changes: SimpleChanges) {

  }

  handleActionClick(event: { action: any; element: any }) {
    if (event.action.actionName === 'delete') {
      this.eliminarEvaluador(event.element.NumeroDocumento);
    }
  }

  async agregarEvaluador() {
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
            console.log(this.listaEvaluadores);
          }
        }
      }
    } else {
      this.popUpManager.showErrorAlert('Verifica los campos');
    }
  }

  async guardarEvaluadorIndividual(data: AsignacionEvaluadorBody): Promise<AsignacionEvaluadorBody> {
    return new Promise((resolve, reject) => {
      this.evaluacionCumplidoProvCrudService
        .post('/asignacion_evaluador', data)
        .subscribe({
          next: (res: any) => {

            resolve(res.Data);
          },
          error: (err: any) => {
            this.popUpManager.showErrorAlert('No fue posible guardar el evaluador');
            console.error(err);
            reject(err);
          },
          complete: () => {
            this.popUpManager.showSuccessAlert('Evaluadores guardados correctamente');
          },
        });
    });
  }


  async guardarEvaluadores() {
    console.log('Lista de evaluadores:', this.listaEvaluadores);
    const rol: RolAsignacionEvaluador = await this.obterRolASignacion('PE');
    this.asignacionEvaluador = this.listaEvaluadores.map((evaluador) => {
      return {
        PersonaId: String(evaluador.NumeroDocumento),
        EvaluacionId:
          this.evaluacion && this.evaluacion.Id
            ? { Id: this.evaluacion.Id }
            : { Id: 0 },
        Cargo: evaluador.Cargo,
        RolAsignacionEvaluadorId: { Id: rol.Id },
        PorcentajeEvaluacion: Number(evaluador.PorcentajeDeEvaluacion),
        ItemsAEvaluar: evaluador.ItemAEvaluar,
      };
    });
    console.log('Asignaciones:', this.asignacionEvaluador);
    let index = 0;

    const resultados = await Promise.allSettled(
      this.asignacionEvaluador.map((data) => {
        return (async () => {

          let asignacion: AsignacionEvaluadorBody = await this.guardarEvaluadorIndividual(data);
          console.log('Asignaciónidddddddddddddddd:', asignacion?.Id);
          await this.guardarItemsEvaluador(asignacion?.Id ?? 0, this.listaItems);
        })();
      })
    );

    resultados.forEach((resultado, index) => {
      console.log('Resultado:', resultado);
      if (resultado.status === 'fulfilled') {
        console.log(`Solicitud ${index + 1} completada con éxito.`);
      } else {
        console.error(`Solicitud ${index + 1} falló:`, resultado.reason);
      }
    });
  }


  async guardarItemsEvaluador(
    asignacionEvaluadorId: number,
    ItemsAEvaluar: any[]
  ) {
    let existe: boolean = false;
    if (ItemsAEvaluar.length > 0) {
      this.evaluacionCumplidoProvCrudService
        .get(
          `/asignacion_evaluador_item/?query=AsignacionEvaluadorId.Id:${asignacionEvaluadorId},Activo:true&limit=-1`
        )
        .subscribe({
          next: (res: any) => {
            if (res.Data[0].Id !== undefined) {
              for (let i = 0; i < res.Data.length; i++) {
                existe = this.itemInLista(res.Data[i].ItemId.Id, ItemsAEvaluar);
                if (!existe) {
                  this.evaluacionCumplidoProvCrudService
                    .delete('/asignacion_evaluador_item', res.Data[i].Id)
                    .subscribe({
                      error: (error: any) => {
                        this.popUpManager.showErrorAlert(
                          `No fue posible eliminar el item ${res.Data[i].Nombre}`
                        );
                        console.error(error);
                      },
                    });
                }
              }
            }


            ItemsAEvaluar.forEach((item) => {

              this.evaluacionCumplidoProvCrudService
                .post('/asignacion_evaluador_item', {
                  AsignacionEvaluadorId: { Id: asignacionEvaluadorId },
                  ItemId: { Id: item.Id },
                })
                .subscribe({
                  error: (error: any) => {
                    this.popUpManager.showErrorAlert(
                      `No fue posible asignar el item ${item} al evaluador.`
                    );
                    console.error(error);
                  },
                });
            });
          },
          error: (error: any) => {
            this.popUpManager.showErrorAlert(
              'No fue posible asignar los items al evaluador'
            );
            console.error(error);
          },
        });
    }
  }

  itemInLista(idItem: number, ItemsAEvaluar: any[]): boolean {
    for (let i = 0; i < ItemsAEvaluar.length; i++) {
      if (ItemsAEvaluar[i].Id == idItem) {
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
      ItemAEvaluar:
        this.formAddEvaluadores.get('item_a_evaluar')?.getRawValue() ?? [],
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
      this.listaEvaluadores = this.listaEvaluadores.filter(
        (evaluador) => evaluador.NumeroDocumento !== id
      );
    }
    this.porcentaje.emit(this.sumarPorcentaje());
  }

  obtenerEvaluador(event: any) {
    const numerodeDocumento = event.target.value;
    this.validarNumero('numero_documento', numerodeDocumento);
    console.log(numerodeDocumento);
    if (numerodeDocumento.length >= 3) {
      this.validarNumero('numero_documento', numerodeDocumento);
      return this.jbpmService
        .get(`/personas_documento/${numerodeDocumento}`)
        .subscribe({
          next: (data) => {
            console.log(data.Personas);
            this.evaluadres = data.Personas;
          },
        });
    }
    return null;
  }

  async obterRolASignacion(codigo: string): Promise<RolAsignacionEvaluador> {
    return new Promise((resolve, reject) => {
      this.evaluacionCumplidoProvCrudService
        .get(`/rol_asignacion_evaluador?query=CodigoAbreviacion:${codigo}`)
        .subscribe({
          next: (res: any) => {
            this.rolAsignacion = res.Data.map((rol: any) => {
              return {
                Id: rol.Id,
                Nombre: rol.Nombre,
                Descripcion: rol.Descripcion,
                CodigoAbreviacion: rol.CodigoAbreviacion,
                Activo: rol.Activo,
              };
            });

            resolve(this.rolAsignacion[0]);
          },
          error: (err) => {
            console.error('Error al obtener rol de asignación:', err);
          },
        });
    });
  }



  async obterEvaluadores(id: number): Promise<Evaluador[]> {
    return new Promise((resolve, reject) => {
      this.evaluacionCumplidoProvCrudService
        .get(`/asignacion_evaluador?query=EvaluacionId.Id:${id}&limit=-1`)
        .subscribe({
          next: async (res: any) => {
            if (res.Data && res.Data.length > 0) {
              this.listaEvaluadores = await Promise.all(res.Data.map(async (asignacion: any) => {
                let items = await this.obtenerItemsAsinagcion(asignacion.Id);
                return {
                  NumeroDocumento: asignacion.PersonaId,
                  Id: asignacion.Id,
                  Cargo: asignacion.Cargo,
                  ItemAEvaluar: items,
                  PorcentajeDeEvaluacion: asignacion.PorcentajeEvaluacion,
                  acciones: [{ icon: 'delete', actionName: 'delete', isActive: true }],
                };
              }));
            }
            resolve(this.listaEvaluadores);
          },
          error: (err) => {
            console.error('Error al obtener rol de asignación:', err);
            reject(err);
          },
        });
    });
  }



  async obtenerItemsAsinagcion(idAsignacion: number): Promise<number[]> {
    let items: number[] = [];
    return new Promise((resolve, reject) => {
      this.evaluacionCumplidoProvCrudService
        .get(`/asignacion_evaluador_item?query=AsignacionEvaluadorId.Id:${idAsignacion}&limit=-1`)
        .subscribe({
          next: (res: any) => {
            if (res.Data && res.Data.length > 0) {
              items = res.Data.map((item: any) => {
                if (item && item.ItemId && item.ItemId.Id !== undefined) {
                  return item.ItemId.Id;
                }
                return null;
              }).filter((id: number | null) => id !== null); 
            }
            resolve(items);
          },
          error: (err) => {
            reject(err);
          },
        });
    });
  }
}
