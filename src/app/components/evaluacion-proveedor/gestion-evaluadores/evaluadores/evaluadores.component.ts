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
import {
  AsignacionEvaluador,
  AsignacionEvaluadorBody,
  TransaccionAsignacionEvaluador,
} from 'src/app/models/evaluacion_cumplido_prov_crud/asignacion_evaluador.model';
import { map } from 'rxjs';
import { RolAsignacionEvaluador } from 'src/app/models/evaluacion_cumplidos_proiveedores_crud/rol_asignacion_evaluador';
import { BodyItem } from 'src/app/models/evaluacion_cumplido_prov_crud/item.model'
import { Evaluacion } from 'src/app/models/evaluacion_cumplido_prov_crud/evaluacion.model';
import { UserService } from 'src/app/services/user.services';
import { AsignacionEvaluadorItem } from 'src/app/models/evaluacion_cumplido_prov_crud/asignacion_evaluador_item.model';
import { CambioEstadoEvaluacion } from 'src/app/models/evaluacion_cumplido_prov_crud/cambio_estado_evaluacion.model';


@Component({
  selector: 'app-evaluadores',
  templateUrl: './evaluadores.component.html',
  styleUrls: ['./evaluadores.component.scss'],
})
export class EvaluadoresComponent implements OnInit {
  panelOpenStateItems = true;
  listaEvaluadores: Evaluador[] = [];
  formAddEvaluadores: FormGroup;
  asignacionEvaluador: TransaccionAsignacionEvaluador[] = [];
  formularioEnviado: boolean = false;
  asignacion!: AsignacionEvaluador;
  rolAsignacion: RolAsignacionEvaluador[] = [];
  documentoSupervisor!: string;
  @Input() listaItems: ItemAEvaluar[] = [];
  @Output() porcentaje = new EventEmitter<number>();
  evaluadores: PersonaNatural[] = [];
  evaluacion!: Evaluacion | null;


  constructor(
    private fb: FormBuilder,
    private popUpManager: PopUpManager,
    private utilsService: UtilsService,
    private cdr: ChangeDetectorRef,
    private evaluacionCumplidoProvCrudService: EvaluacionCumplidoProvCrudService,
    private jbpmService: JbpmService,
    private user: UserService,
  ) {
    this.documentoSupervisor = user.getPayload().documento;
    console.log('Documento Supervisor:', this.documentoSupervisor)
    this.formAddEvaluadores = this.fb.group({
      numero_documento: ['', [Validators.required]],
      cargo: ['', [Validators.required]],
      item_a_evaluar: [[], [Validators.required]],
      porcentaje: ['', [Validators.required]],
    });
  }

  async ngOnInit() {
    await this.evaluacionCumplidoProvCrudService.evaluacion$.subscribe((evaluacion) => {
      this.evaluacion = evaluacion;
    })
    await this.refrescarEvaluadores();
  }


  ngOnChanges(changes: SimpleChanges) {

  }

  async refrescarEvaluadores(){
    await this.evaluacionCumplidoProvCrudService
    .get(`/asignacion_evaluador/?query=EvaluacionId.Id:${this.evaluacion?.Id},Activo:true`)
    .pipe(
      map((res: any) => res.Data as AsignacionEvaluador[])
    )
    .subscribe({
      next: (data: AsignacionEvaluador[]) => {
        if (data[0].Id !== undefined){
          data.map((asignacion) => {
            
            this.obtenerItemsAsinagcion(asignacion.Id)
            .then((items) => {
              console.log("Items:",items )
              this.listaEvaluadores = [
                ...this.listaEvaluadores,
                {
                  NumeroDocumento: asignacion.PersonaId,
                  Cargo: asignacion.Cargo,
                  ItemAEvaluar: items,
                  PorcentajeDeEvaluacion: asignacion.PorcentajeEvaluacion,
                  acciones: [{ icon: 'delete', actionName: 'delete', isActive: true }],
                }
              ]
              this.porcentaje.emit(this.sumarPorcentaje());
            })
          })

        }
      },
      error: (error: any) => {
        this.popUpManager.showErrorAlert('No fue posible obtener los evaluadores');
      }
    })
  }

  handleActionClick(event: { action: any; element: any }) {
    if (event.action.actionName === 'delete') {
      this.eliminarEvaluador(event.element.NumeroDocumento);
    }
  }

  async agregarEvaluador() {
    if (this.validarFromulario()) {
      const existe = this.listaEvaluadores.find(
        (item) =>
          item.NumeroDocumento === this.obtenerInfoFormulario().NumeroDocumento
      );

      if (existe !== undefined) {
        let confirm = await this.popUpManager.showConfirmAlert(`El evaluador identificado con documento ${existe.NumeroDocumento} ya existe ¿Desea sobreescribirlo?`)
        if (confirm.isConfirmed) {
          this.listaEvaluadores = this.listaEvaluadores.map((evaluador) => {
            if (evaluador.NumeroDocumento === existe.NumeroDocumento) {
              evaluador = existe;
              return this.obtenerInfoFormulario();
            }
            return evaluador;
          });
          this.porcentaje.emit(this.sumarPorcentaje());
          this.formAddEvaluadores.reset();
        }
      } else {
        let confirm = await this.popUpManager.showConfirmAlert(
          '¿Estás seguro de agregar el evaluador y sus items?'
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

  async guardarEvaluadorIndividual(data: TransaccionAsignacionEvaluador): Promise<TransaccionAsignacionEvaluador> {
    return new Promise((resolve, reject) => {
      this.evaluacionCumplidoProvCrudService
        .post('/crear_solicitud_asignacion_evaluador', data)
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
    this.asignacionEvaluador = this.listaEvaluadores.map((evaluador) => {
      return {
        EvaluacionId: this.evaluacion && this.evaluacion.Id ? this.evaluacion.Id : 0,
        PersonaId: String(evaluador.NumeroDocumento),
        Cargo: evaluador.Cargo,
        PorcentajeEvaluacion: Number(evaluador.PorcentajeDeEvaluacion)/100,
        RolAsignacionEvaluador: this.documentoSupervisor === String(evaluador.NumeroDocumento) ?  'SP': 'EV',
        ItemsAEvaluar: evaluador.ItemAEvaluar.map((item) => item.Id),
      };
    });

    await this.eliminarEvaluadores();

    const resultados = await Promise.allSettled(
      this.asignacionEvaluador.map((data) => {
        return (async () => {
          let asignacion: TransaccionAsignacionEvaluador = await this.guardarEvaluadorIndividual(data);
          console.log("Data", data)
          await this.guardarItemsEvaluador(asignacion?.Id ?? 0, data.ItemsAEvaluar ?? []);
        })();
      })
    );


    resultados.forEach((resultado, index) => {
      if (resultado.status === 'fulfilled') {
        console.log(`Solicitud ${index + 1} completada con éxito.`);
      } else {
        console.error(`Solicitud ${index + 1} falló:`, resultado.reason);
      }
    });
  }

  async eliminarEvaluadores(){
    await this.evaluacionCumplidoProvCrudService
    .get(`/asignacion_evaluador/?query=EvaluacionId.Id:${this.evaluacion?.Id},Activo:true`)
    .pipe(
      map((res: any) => res.Data as AsignacionEvaluador[])
    )
    .subscribe({
      next: (data: AsignacionEvaluador[]) => {
        if (data[0].Id !== undefined){
          data.map((asignacion) => {
            let existe = this.evaluadorInLista(String(asignacion.PersonaId), this.listaEvaluadores);
            if (!existe){
              this.evaluacionCumplidoProvCrudService
              .delete('/asignacion_evaluador', asignacion.Id)
              .subscribe({
                error: (error: any) => {
                  this.popUpManager.showErrorAlert(
                    `No fue posible eliminar el evaluador ${asignacion.PersonaId}`
                  );
                  console.error(error);
                },
              });
            }
          })
        }
      },
      error: (error: any) => {
        this.popUpManager.showErrorAlert(
          'No fue posible eliminar los evaluadores'
        );
        console.error(error);
      },
    })
  }

  desactivarEstadosAnterioresEvaluacion(){
    this.evaluacionCumplidoProvCrudService
    .get(`/cambio_estado_evaluacion/?query=EvaluacionId.Id:${this.evaluacion?.Id},Activo:true&limit=-1&sortby=FechaCreacion&order=desc`)
    .pipe(
      map ((res:any) => res.Data as CambioEstadoEvaluacion[])
    )
    .subscribe({
      next: (data:CambioEstadoEvaluacion[]) => {
        if (data[0].Id !== undefined){
          data.forEach((cambioEstado) => {
            this.evaluacionCumplidoProvCrudService
            .delete(`/cambio_estado_evaluacion`, cambioEstado.Id)
          })
        }
      },
      error: (error: any) => {
        this.popUpManager.showErrorAlert('No fue posible desactivar los estados anteriores de la evaluación')
      }
    })
  }

  async guardarItemsEvaluador(
    asignacionEvaluadorId: number,
    ItemsAEvaluar: number[]
  ) {
    if (ItemsAEvaluar.length > 0) {
      this.evaluacionCumplidoProvCrudService
        .get(
          `/asignacion_evaluador_item/?query=AsignacionEvaluadorId.Id:${asignacionEvaluadorId},Activo:true&limit=-1`
        )
        .subscribe({
          next: (res: any) => {
            if (res.Data[0].Id !== undefined) {
              for (let i = 0; i < res.Data.length; i++) {
                let existe = this.itemInLista(res.Data[i].ItemId.Id, ItemsAEvaluar);
                console.log("Item Actual:", res.Data[i].ItemId.Id, "Items a evaluar:", ItemsAEvaluar)
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
                  ItemId: { Id: item },
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


  evaluadorInLista(docEvaluador: string, Evaluadores: Evaluador[]){
    for (let i = 0; i < Evaluadores.length; i++) {
      if (String(Evaluadores[i].NumeroDocumento) === docEvaluador) {
        return true;
      }
    }
    return false;
  }

  itemInLista(idItem: number, ItemsAEvaluar: number[]): boolean {
    for (let i = 0; i < ItemsAEvaluar.length; i++) {
      if (ItemsAEvaluar[i] == idItem) {
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
      if(evaluador.PorcentajeDeEvaluacion < 1){
        evaluador.PorcentajeDeEvaluacion = evaluador.PorcentajeDeEvaluacion * 100;
      }
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
            this.evaluadores = data.Personas;
          },
        });
    }
    return null;
  }

  async obtenerRolASignacion(codigo: string): Promise<RolAsignacionEvaluador> {
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


  async obtenerItemsAsinagcion(idAsignacion: number): Promise<Item[]> {
    return new Promise((resolve, reject) => {
      this.evaluacionCumplidoProvCrudService
        .get(`/asignacion_evaluador_item?query=AsignacionEvaluadorId.Id:${idAsignacion},Activo:true&limit=-1`)
        .pipe(
          map((res: any) => res.Data as AsignacionEvaluadorItem[])
        )
        .subscribe({
          next: (data: AsignacionEvaluadorItem[]) => {
            if (data.length > 0 && data[0].ItemId !== undefined) {
              data.map((item) => {
                const items = data.map(item => item.ItemId);
                resolve(items);
              })
            } else {
              resolve([]);
            }
          },
          error: (error: any) => {
            this.popUpManager.showErrorAlert('No fue posible obtener los items del evaluador');
            reject(error);
          }
        })
    });
  }
}
