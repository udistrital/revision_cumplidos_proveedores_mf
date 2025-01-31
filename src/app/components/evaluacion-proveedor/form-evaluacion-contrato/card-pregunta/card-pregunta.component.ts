import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import {
  Resultado,
  ResultadoIndividual,
} from 'src/app/models/evaluacion_cumplido_prov_mid/informacion-evaluacion.model';
import { Respuesta } from './../../../../models/evaluacion_cumplido_prov_mid/informacion-evaluacion.model';
import { PopUpManager } from './../../../../managers/popUpManager';
import { EvaluacionCumplidoProvCrudService } from 'src/app/services/evaluacion_cumplido_prov_crud';
import { AsignacionEvaluador } from 'src/app/models/evaluacion_cumplido_prov_crud/asignacion_evaluador.model';
import { EvaluacionCumplidosProveedoresMidService } from 'src/app/services/evaluacion_cumplidos_provedores_mid.service';
import { CambioEstadoAsignacionEvalacion } from 'src/app/models/evaluacion_cumplido_prov_crud/cambio_estado.asignacion_evaluador';
import { routes } from './../../../../app-routing.module';
import { Router } from '@angular/router';
import { Evaluacion } from 'src/app/models/evaluacion_cumplido_prov_crud/evaluacion.model';

@Component({
  selector: 'app-card-pregunta',
  templateUrl: './card-pregunta.component.html',
  styleUrls: ['./card-pregunta.component.scss'],
})
export class CardPreguntaComponent {
  porcentaje: number = 0;
  preguntaIndex: number = 0;
  formularioEnviado: boolean = false;
  puntaJeTotalCumplimiento: number = 0;
  puntajeTotalCalidad: number = 0;
  puntajeTotalPosContraActual: number = 0;
  puntajeTotalGestion: number = 0;
  asignacionEvaluador!: CambioEstadoAsignacionEvalacion;
  ocultarPreguntaGarantia: boolean = false;
  ocultaPreguntaReclamaciones: boolean = false;
  valorSeleccionado: number = 0;
  calificacionTexto: string = 'Sin calificar';


  @Input() pregunta: any; 
  @Input() visualizacion: boolean = false; 
  @Output() respuestaChange = new EventEmitter<any>();

  FormularioPregunta: FormGroup;

  puntajesTotales: number[] = [];
  evaluacion!: Evaluacion | null;

  

  constructor(
    private fb: FormBuilder,
    private popUpManager: PopUpManager,
    private evaluacionCumplidosCrud: EvaluacionCumplidoProvCrudService,
    private evaluacionCumplidosMid: EvaluacionCumplidosProveedoresMidService,
    private router: Router
  ) {
    this.FormularioPregunta = this.fb.group({
      cumplimiento: ['', Validators.required],
    });
  }

  async ngOnInit() {
    this.asignacionEvaluador = await this.consultarAsignacionEvaluador();
    this.evaluacion = await this.evaluacionCumplidosCrud.getEvaluacion();
    if (this.visualizacion) {
      this.FormularioPregunta.get('cumplimiento')?.setValue(this.pregunta.cumplimiento);
      this.FormularioPregunta.disable();
    } else {
      this.FormularioPregunta.valueChanges.subscribe(() => {
        this.valorSeleccionado = this.FormularioPregunta.get('cumplimiento')?.value;
        this.emitirRespuesta();
      });
    }
  }

  emitirRespuesta() {
    if (this.FormularioPregunta.valid) {
      const respuesta = {
        pregunta: this.pregunta.pregunta,
        valorSeleccionado: this.FormularioPregunta.get('cumplimiento')?.value,
      };
      this.respuestaChange.emit(respuesta);
    }
  }

  get cumplimientoControl(): FormControl {
    return this.FormularioPregunta.get('cumplimiento') as FormControl;
  }


  

  

  // getCumplimiento(index: number): FormControl {
  //   const respuestas = this.FormularioEvaluacion.get('respuestas') as FormArray;
  //   const respuestaGroup = respuestas.at(index).get('Respuesta') as FormGroup;
  //   const cumplimiento = respuestaGroup.get('Cumplimiento') as FormControl;

  //   if (cumplimiento) {
  //     return cumplimiento;
  //   } else {
  //     throw new Error('El campo "Cumplimiento" no es un FormControl');
  //   }
  // }
  // enviarEvaluacion() {
  //   this.formularioEnviado = true;
  //   this.marcarCamposComoTocados(this.FormularioEvaluacion);
  //   if (this.FormularioEvaluacion.valid) {
  //     if (
  //       this.asignacionEvaluador.EstadoAsignacionEvaluadorId
  //         .CodigoAbreviacion == 'EA'
  //     ) {
  //       this.evaluacionCumplidosMid
  //         .post('/resultado/resultado-evaluacion', this.crearCuerpoRespuesta())
  //         .subscribe({
  //           next: (res: any) => {},
  //           error: (error: any) => {
  //             this.popUpManager.showErrorAlert('Error al enviar la evaluación');
  //           },
  //           complete: () => {
  //             this.router.navigate(['/listar-contratos-evaluar'], {
  //               queryParams: {
  //                 mensajeDeConfirmacion: 'Evaluación enviada correctamente',
  //               },
  //             });

  //             // let cambioEstado = {
  //             //   AsignacionId: {
  //             //     Id: 45,
  //             //   },
  //             //   AbreviacionEstado: 'ER',
  //             // };
  //             // this.evaluacionCumplidosMid
  //             //   .post(`/cambio_estado_asignacion_evaluador/`, cambioEstado)
  //             //   .subscribe({
  //             //     next: (res: any) => {},
  //             //     error: (error: any) => {
  //             //       this.popUpManager.showErrorAlert(
  //             //         'Error al cambiar es   estado evaluación'
  //             //       );
  //             //     },
  //             //   });
  //           },
  //         });
  //     } else {
  //       this.popUpManager.showErrorAlert(
  //         'El estado de la asignación no permite realizar la evaluación'
  //       );
  //     }
  //   } else {
  //     this.popUpManager.showErrorAlert(
  //       'Por favor responda todas las preguntas'
  //     );
  //   }
  // }

  async consultarAsignacionEvaluador(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.evaluacionCumplidosCrud
        .get(
          `/cambio_estado_asignacion_evaluador/?query=AsignacionEvaluadorId.Id:${41},Activo:true`
        )
        .subscribe({
          next: (res: any) => {
            let CambioEstadoAsignacionEvalacion = res.Data[0];
            resolve(CambioEstadoAsignacionEvalacion);
          },
          error: (error: any) => {
            reject(error);
          },
        });
    });
  }
  // crearCuerpoRespuesta() {
  //   const respuestas = (
  //     this.FormularioEvaluacion.get('respuestas') as FormArray
  //   ).value;
  //   const observaciones = this.FormularioEvaluacion.get('observaciones')?.value;

  //   const resultadoEvaluacion = {
  //     Obbservaciones: observaciones,
  //     AsignacionEvaluadorId: this.asignacionEvaluador.Id,
  //     ClasificacionId: 1,
  //     ResultadoEvaluacion: {
  //       ResultadosIndividuales: respuestas.map((respuesta: any) => ({
  //         Categoria: respuesta.Categoria,
  //         Titulo: respuesta.Titulo,
  //         Respuesta: {
  //           Pregunta: respuesta.Respuesta.Pregunta,
  //           Cumplimiento: respuesta.Respuesta.Cumplimiento,
  //           ValorAsignado: respuesta.Respuesta.ValorAsignado,
  //         },
  //       })),
  //     },
  //   };
  //   return resultadoEvaluacion;
  // }

  marcarCamposComoTocados(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.marcarCamposComoTocados(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach((controlItem) => {
          controlItem.markAsTouched();
        });
      }
    });
  }



  obtenerCalificaiconTexto(puntaje:number) {

  if(puntaje>=80 && puntaje<=100){
    this.calificacionTexto = "Excelente"
    
  }

  if(puntaje>=46 && puntaje<=79){
     this.calificacionTexto = "Bueno"

  }

  if(puntaje>=0 && puntaje<=45){
     this.calificacionTexto = "Malo"
  }
}
 
}
