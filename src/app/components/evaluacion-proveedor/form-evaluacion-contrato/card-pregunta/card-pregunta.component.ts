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
import { EvaluacionCumplidoProvCrudService } from 'src/app/services/evaluacion_cumplido_prov_crud';
import { CambioEstadoAsignacionEvalacion } from 'src/app/models/evaluacion_cumplido_prov_crud/cambio_estado.asignacion_evaluador';
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
    private evaluacionCumplidosCrud: EvaluacionCumplidoProvCrudService,
  ) {
    this.FormularioPregunta = this.fb.group({
      cumplimiento: ['', Validators.required],
    });
  }

  async ngOnInit() {
    this.evaluacion = await this.evaluacionCumplidosCrud.getEvaluacion();
    if (this.visualizacion) {
      this.FormularioPregunta.get('cumplimiento')?.setValue(this.pregunta.cumplimiento);
      this.FormularioPregunta.disable();
    } else {
      this.FormularioPregunta.valueChanges.subscribe(() => {
        const opcion = Number(this.FormularioPregunta.get('cumplimiento')?.value)
        this.valorSeleccionado = this.pregunta.valorAsignado[opcion].valor;
        this.emitirRespuesta();
      });
    }
  }

  emitirRespuesta() {
    if (this.FormularioPregunta.valid) {
      const opcion = Number(this.FormularioPregunta.get('cumplimiento')?.value)
      const respuesta = {
        pregunta: this.pregunta.pregunta,
        opcionSeleccionada: this.pregunta.valorAsignado[opcion].cumplimiento,
        valorSeleccionado: this.pregunta.valorAsignado[opcion].valor,
      };
      this.respuestaChange.emit(respuesta);
    }
  }

  get cumplimientoControl(): FormControl {
    return this.FormularioPregunta.get('cumplimiento') as FormControl;
  }
 
}
