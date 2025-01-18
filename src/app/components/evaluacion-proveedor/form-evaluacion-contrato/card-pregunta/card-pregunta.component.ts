import { Component, Input } from '@angular/core';
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
  FormularioEvaluacion: FormGroup;
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
  calificacionTexto: string = 'Sin calificar';

  @Input() resultadoEvaluador?: Resultado;
  @Input() puntajeTotal?: number = 0;
  @Input() clasificacion?: string;
  @Input({ required: true }) visualizacion: boolean = false;
  puntajesTotales: number[] = [];
  evaluacion!: Evaluacion | null;

  listaPreguntas = [
    {
      elemento: 'Cumplimiento',
      preguntas: [
        {
          titulo: 'Tiempos de entrega',
          pregunta:
            '¿Se cumplieron los tiempos de entrega de bienes o la prestación del servicios ofertados por el proveedor?',
          valorAsignado: 10,
          cumplimiento: '',
          index: 0,
        },
        {
          titulo: 'Cantidades',
          pregunta: '¿Se entregan las cantidades solicitadas?',
          valorAsignado: 10,
          cumplimiento: '',
          index: 0,
        },
      ],
    },
    {
      elemento: 'Calidad',
      preguntas: [
        {
          titulo: 'Conformidad',
          pregunta:
            '¿El bien o servicio cumplió con las especificaciones y requisitos pactados en el momento de entrega?',
          valorAsignado: 10,
          cumplimiento: '',
          index: 0,
        },
        {
          titulo: 'Funcionalidad adicional',
          pregunta:
            '¿El producto comprado o el servicio prestado proporcionó más herramientas o funciones de las solicitadas originalmente?',
          valorAsignado: 20,
          cumplimiento: '',
          index: 0,
        },
      ],
    },
    {
      elemento: 'Pos contractual',
      preguntas: [
        {
          titulo: 'Reclamaciones',
          pregunta:
            '¿Se han presentado reclamaciones al proveedor en calidad o gestión?',
          valorAsignado: 10,
          cumplimiento: '',
          index: 0,
        },
        {
          titulo: 'Reclamaciones',
          pregunta:
            '¿El proveedor soluciona oportunamente las no conformidades de calidad y gestión de los bienes o servicios recibidos?',
          valorAsignado: 10,
          cumplimiento: '',
          index: 0,
        },
        {
          titulo: 'Servicio pos venta',
          pregunta:
            '¿El proveedor cumple con los compromisos pactados dentro del contrato u orden de servicio o compra? (aplicación de garantías, mantenimiento, cambios, reparaciones, capacitaciones, entre otras)',
          valorAsignado: 10,
          cumplimiento: '',
          index: 0,
        },
      ],
    },
    {
      elemento: 'Gestión',
      preguntas: [
        {
          titulo: 'Procedimientos',
          pregunta:
            '¿El contrato es suscrito en el tiempo pactado, entrega las pólizas a tiempo y las facturas son radicadas en el tiempo indicado con las condiciones y soportes requeridos para su trámite contractual?',
          valorAsignado: 10,
          cumplimiento: '',
          index: 0,
        },
        {
          titulo: 'Garantía',
          pregunta:
            '¿Se requirió hacer uso de la garantía del producto o servicio?',
          valorAsignado: 10,
          cumplimiento: '',
          index: 0,
        },
        {
          titulo: 'Garantía',
          pregunta:
            ' ¿El proveedor cumplió a satisfacción con la garantía pactada?',
          valorAsignado: 10,
          cumplimiento: '',
          index: 0,
        },
      ],
    },
  ];

  constructor(
    private fb: FormBuilder,
    private popUpManager: PopUpManager,
    private evaluacionCumplidosCrud: EvaluacionCumplidoProvCrudService,
    private evaluacionCumplidosMid: EvaluacionCumplidosProveedoresMidService,
    private router: Router
  ) {
    let indexPreginta = 0;

    this.listaPreguntas.forEach((item) => {
      item.preguntas.forEach((pregunta) => {
        pregunta.index = indexPreginta++;
      });
    });

    const controls = this.listaPreguntas.flatMap((item) =>
      item.preguntas.map((pregunta) =>
        this.fb.group({
          Categoria: item.elemento,
          Titulo: pregunta.titulo,
          Respuesta: this.fb.group({
            Pregunta: pregunta.pregunta,
            Cumplimiento: ['', Validators.required],
            ValorAsignado: pregunta.valorAsignado,
          }),
        })
      )
    );

    this.FormularioEvaluacion = this.fb.group({
      respuestas: this.fb.array(controls),
      observaciones: '',
    });

    const respuestas = this.FormularioEvaluacion.get('respuestas') as FormArray;

    respuestas.valueChanges.subscribe(() => {
      this.porcentaje = this.sumarPorcentajes();
    });
  }

  async ngOnInit() {
    this.asignacionEvaluador = await this.consultarAsignacionEvaluador();
    if (this.visualizacion) {
      this.actualizarPreguntas(this.resultadoEvaluador!.ResultadosIndividuales);
    }
    this.evaluacion = await this.evaluacionCumplidosCrud.getEvaluacion();
    this.calcularTotalesPorSeccion();
  }

  actualizarPreguntas(resultadosIndividuales: ResultadoIndividual[]) {
    this.listaPreguntas.forEach((categoria) => {
      categoria.preguntas.forEach((pregunta) => {
        const respuesta = resultadosIndividuales.find(
          (resultado) =>
            resultado.Categoria.toUpperCase() ===
              categoria.elemento.toUpperCase() &&
            resultado.Titulo.toUpperCase() === pregunta.titulo.toUpperCase() &&
            resultado.Respuesta.Pregunta.toUpperCase() ===
              pregunta.pregunta.toUpperCase()
        );

        if (respuesta) {
          pregunta.valorAsignado = respuesta.Respuesta.ValorAsignado;
          pregunta.cumplimiento = respuesta.Respuesta.Cumplimiento;
        }
      });
    });
    this.calcularTotalesPorSeccion();
  }

  calcularTotalesPorSeccion() {
    this.puntajesTotales = this.listaPreguntas.map((item) =>
      item.preguntas.reduce(
        (total, pregunta) => total + (pregunta.valorAsignado || 0),
        0
      )
    );
  }

  sumarPorcentajes() {
    let total = 0;
    const respuestas = this.FormularioEvaluacion.get('respuestas') as FormArray;
    this.puntajeTotal = 0;
    this.puntaJeTotalCumplimiento = 0;
    this.puntajeTotalCalidad = 0;
    this.puntajeTotalPosContraActual = 0;
    this.puntajeTotalGestion = 0;
    respuestas.controls.forEach((control: any, index: number) => {
      if (control.value.Categoria == 'Cumplimiento') {
        if (control.value.Respuesta.Cumplimiento === 'Si') {
          const pregunta = this.getPreguntaPorIndex(index);
          if (pregunta) {
            this.puntaJeTotalCumplimiento += pregunta.valorAsignado;
          }
        }
      }

      if (control.value.Categoria == 'Calidad') {
        if (control.value.Respuesta.Cumplimiento === 'Si') {
          const pregunta = this.getPreguntaPorIndex(index);
          if (pregunta) {
            this.puntajeTotalCalidad += pregunta.valorAsignado;
          }
        }
      }
      if (control.value.Categoria == 'Pos contractual') {
        if (control.value.Respuesta.Cumplimiento === 'No') {
          if (
            control.value.Respuesta.Pregunta ==
            '¿Se han presentado reclamaciones al proveedor en calidad o gestión?'
          ) {
            this.ocultaPreguntaReclamaciones = true;
            const pregunta = this.getPreguntaPorIndex(index);
            if (pregunta) {
              this.puntajeTotalPosContraActual += pregunta.valorAsignado;
            }
          }
        }

        if (control.value.Respuesta.Cumplimiento === 'Si') {
          if (
            control.value.Respuesta.Pregunta !=
            '¿Se han presentado reclamaciones al proveedor en calidad o gestión?'
          ) {
            const pregunta = this.getPreguntaPorIndex(index);
            if (pregunta) {
              this.puntajeTotalPosContraActual += pregunta.valorAsignado;
            }
          }
        }
      }

      if (control.value.Categoria == 'Gestión') {
        
        if (control.value.Respuesta.Cumplimiento === 'No') {
          if (
            control.value.Respuesta.Pregunta ==
            '¿Se requirió hacer uso de la garantía del producto o servicio?'
          ) {
            this.ocultarPreguntaGarantia = true;
            const pregunta = this.getPreguntaPorIndex(index);
            if (pregunta) {
              this.puntajeTotalGestion += pregunta.valorAsignado;
            }
          }
        }

        if (control.value.Respuesta.Cumplimiento === 'Si') {
          if (
            control.value.Respuesta.Pregunta !=
            '¿Se requirió hacer uso de la garantía del producto o servicio?'
          ) {
            const pregunta = this.getPreguntaPorIndex(index);
            if (pregunta) {
              this.puntajeTotalGestion += pregunta.valorAsignado;
            }
          }
        }
      }

      this.puntajeTotal =
        this.puntaJeTotalCumplimiento +
        this.puntajeTotalCalidad +
        this.puntajeTotalPosContraActual +
        this.puntajeTotalGestion;
    });

    this.obtenerCalificaiconTexto(this.puntajeTotal);
    return total;
  }

  getPreguntaPorIndex(index: number) {
    let acumulado = 0;
    for (const grupo of this.listaPreguntas) {
      for (const pregunta of grupo.preguntas) {
        if (acumulado === index) {
          return pregunta;
        }
        acumulado++;
      }
    }
    return null;
  }

  getCumplimiento(index: number): FormControl {
    const respuestas = this.FormularioEvaluacion.get('respuestas') as FormArray;
    const respuestaGroup = respuestas.at(index).get('Respuesta') as FormGroup;
    const cumplimiento = respuestaGroup.get('Cumplimiento') as FormControl;

    if (cumplimiento) {
      return cumplimiento;
    } else {
      throw new Error('El campo "Cumplimiento" no es un FormControl');
    }
  }
  enviarEvaluacion() {
    this.formularioEnviado = true;
    this.marcarCamposComoTocados(this.FormularioEvaluacion);
    if (this.FormularioEvaluacion.valid) {
      if (
        this.asignacionEvaluador.EstadoAsignacionEvaluadorId
          .CodigoAbreviacion == 'EA'
      ) {
        this.evaluacionCumplidosMid
          .post('/resultado/resultado-evaluacion', this.crearCuerpoRespuesta())
          .subscribe({
            next: (res: any) => {},
            error: (error: any) => {
              this.popUpManager.showErrorAlert('Error al enviar la evaluación');
            },
            complete: () => {
              this.router.navigate(['/listar-contratos-evaluar'], {
                queryParams: {
                  mensajeDeConfirmacion: 'Evaluación enviada correctamente',
                },
              });

              // let cambioEstado = {
              //   AsignacionId: {
              //     Id: 45,
              //   },
              //   AbreviacionEstado: 'ER',
              // };
              // this.evaluacionCumplidosMid
              //   .post(`/cambio_estado_asignacion_evaluador/`, cambioEstado)
              //   .subscribe({
              //     next: (res: any) => {},
              //     error: (error: any) => {
              //       this.popUpManager.showErrorAlert(
              //         'Error al cambiar es   estado evaluación'
              //       );
              //     },
              //   });
            },
          });
      } else {
        this.popUpManager.showErrorAlert(
          'El estado de la asignación no permite realizar la evaluación'
        );
      }
    } else {
      this.popUpManager.showErrorAlert(
        'Por favor responda todas las preguntas'
      );
    }
  }

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
  crearCuerpoRespuesta() {
    const respuestas = (
      this.FormularioEvaluacion.get('respuestas') as FormArray
    ).value;
    const observaciones = this.FormularioEvaluacion.get('observaciones')?.value;

    const resultadoEvaluacion = {
      Obbservaciones: observaciones,
      AsignacionEvaluadorId: this.asignacionEvaluador.Id,
      ClasificacionId: 1,
      ResultadoEvaluacion: {
        ResultadosIndividuales: respuestas.map((respuesta: any) => ({
          Categoria: respuesta.Categoria,
          Titulo: respuesta.Titulo,
          Respuesta: {
            Pregunta: respuesta.Respuesta.Pregunta,
            Cumplimiento: respuesta.Respuesta.Cumplimiento,
            ValorAsignado: respuesta.Respuesta.ValorAsignado,
          },
        })),
      },
    };
    return resultadoEvaluacion;
  }

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
