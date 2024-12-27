import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Resultado, ResultadoIndividual } from 'src/app/models/evaluacion_cumplido_prov_mid/informacion-evaluacion.model';

@Component({
  selector: 'app-card-pregunta',
  templateUrl: './card-pregunta.component.html',
  styleUrls: ['./card-pregunta.component.scss'],
})
export class CardPreguntaComponent {
  evaluacion: FormGroup;
  porcentaje: number = 0;
  preguntaIndex:number=0;

  @Input() resultadoEvaluador?: Resultado;
  @Input() puntajeTotal?: number;
  @Input() clasificacion?: string;
  @Input({required: true}) visualizacion: boolean = false;
  puntajesTotales: number[] = [];


  listaPreguntas = [
    {
      elemento: 'Cumplimiento',
      preguntas: [
        {
          caracteristica: 'Tiempos de entrega',
          pregunta:
            '¿Se cumplieron los tiempos de entrega de bienes o la prestación del servicios ofertados por el proveedor?',
          porcentaje: 10,
          cumplimiento: "",
        },
        {
          caracteristica: 'Cantidades',
          pregunta: '¿Se entregan las cantidades solicitadas?',
          porcentaje: 10,
          cumplimiento: "",
        },
      ],
    },
    {
      elemento: 'Calidad',
      preguntas: [
        {
          caracteristica: 'Conformidad',
          pregunta:
            '¿El bien o servicio cumplió con las especificaciones y requisitos pactados en el momento de entrega?',
          porcentaje: 10,
          cumplimiento: "",
        },
        {
          caracteristica: 'Funcionalidad adicional',
          pregunta:
            '¿El producto comprado o el servicio prestado proporcionó más herramientas o funciones de las solicitadas originalmente?',
          porcentaje: 20,
          cumplimiento: "",
        },
      ],
    },
    {
      elemento: 'Pos contractual',
      preguntas: [
        {
          caracteristica: 'Reclamaciones',
          pregunta:
            '¿Se han presentado reclamaciones al proveedor en calidad o gestión?',
          porcentaje: 10,
          cumplimiento: "",
        },
        {
          caracteristica: 'Reclamaciones',
          pregunta:
            '¿El proveedor soluciona oportunamente las no conformidades de calidad y gestión de los bienes o servicios recibidos?',
          porcentaje: 10,
          cumplimiento: "",
        },
        {
          caracteristica: 'Servicio pos venta',
          pregunta:
            '¿El proveedor cumple con los compromisos pactados dentro del contrato u orden de servicio o compra? (aplicación de garantías, mantenimiento, cambios, reparaciones, capacitaciones, entre otras)',
          porcentaje: 10,
          cumplimiento: "",
        },
      ],
    },
    {
      elemento: 'Gestión',
      preguntas: [
        {
          caracteristica: 'Procedimientos',
          pregunta:
            '¿El contrato es suscrito en el tiempo pactado, entrega las pólizas a tiempo y las facturas son radicadas en el tiempo indicado con las condiciones y soportes requeridos para su trámite contractual?',
          porcentaje: 10,
          cumplimiento: "",
        },
        {
          caracteristica: 'Garantía',
          pregunta:
            '¿Se requirió hacer uso de la garantía del producto o servicio?',
          porcentaje: 10,
          cumplimiento: "",
        },
        {
          caracteristica: 'Garantía',
          pregunta:
            ' ¿El proveedor cumplió a satisfacción con la garantía pactada?',
          porcentaje: 10,
          cumplimiento: "", 
        }
      ],
    },
  ];



  constructor(private fb: FormBuilder) {
    const controls = this.listaPreguntas.flatMap(item =>
      item.preguntas.map(() => this.fb.control(''))
    );

    this.evaluacion = this.fb.group({
      respuestas: this.fb.array(controls),
      observaciones: ['', [Validators.required]],
    });

    const respuestas = this.evaluacion.get('respuestas') as FormArray;
    respuestas.valueChanges.subscribe(() => {
      this.porcentaje = this.sumarPorcentajes();
    });

  }

  async ngOnInit() {
    if (this.visualizacion){
      this.actualizarPreguntas(this.resultadoEvaluador!.ResultadosIndividuales);
    }
    this.calcularTotalesPorSeccion();
  }


  actualizarPreguntas(resultadosIndividuales: ResultadoIndividual[]){
    this.listaPreguntas.forEach(categoria => {
      categoria.preguntas.forEach(pregunta => {

        const respuesta = resultadosIndividuales.find(resultado =>
          resultado.Categoria.toUpperCase() === categoria.elemento.toUpperCase() &&
          resultado.Titulo.toUpperCase() === pregunta.caracteristica.toUpperCase() &&
          resultado.Respuesta.Pregunta.toUpperCase() === pregunta.pregunta.toUpperCase()
        );

        if (respuesta) {
          pregunta.porcentaje = respuesta.Respuesta.ValorAsignado;
          pregunta.cumplimiento = respuesta.Respuesta.Cumplimiento;
        }
      });
    });
    this.calcularTotalesPorSeccion();
  }

  calcularTotalesPorSeccion() {
    this.puntajesTotales = this.listaPreguntas.map(item =>
      item.preguntas.reduce((total, pregunta) => total + (pregunta.porcentaje || 0), 0)
    );
  }

  sumarPorcentajes() {
    let total = 0;
    const respuestas = this.evaluacion.get('respuestas') as FormArray;
    console.log(respuestas)

    respuestas.controls.forEach((control: any, index: number) => {
      if (control.value === 'si') {
        const pregunta = this.getPreguntaPorIndex(index);
        if (pregunta) {
          total += pregunta.porcentaje;
        }
      }
    });

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


  enviarEvaluacion() {

  }
}
