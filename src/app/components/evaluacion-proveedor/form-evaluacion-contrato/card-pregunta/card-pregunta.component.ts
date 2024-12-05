import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-card-pregunta',
  templateUrl: './card-pregunta.component.html',
  styleUrls: ['./card-pregunta.component.scss'],
})
export class CardPreguntaComponent {
  evaluacion: FormGroup;
  porcentage: number = 0;
  preguntaIndex:number=0
  listaPreguntas = [
    {
      elemento: 'Cumplimiento',
      preguntas: [
        {
          caracteristica: 'Tiempos de entrega',
          pregunta:
            '¿Se cumplieron los tiempos de entrega de bienes o la prestación de servicios ofertados por el proveedor?',
          porcentaje: 10,
        },
        {
          caracteristica: 'Cantidades',
          pregunta: '¿Se entregaron las cantidades solicitadas?',
          porcentaje: 10,
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
        },
        {
          caracteristica: 'Funcionalidad adicional',
          pregunta:
            '¿El producto comprado o el servicio prestado proporcionó más herramientas o funciones solicitadas originalmente?',
          porcentaje: 20,
        },
      ],
    },
    {
      elemento: 'Post contractual',
      preguntas: [
        {
          caracteristica: 'Reclamaciones',
          pregunta:
            '¿Se han presentado reclamaciones al proveedor en calidad o gestión?',
          porcentaje: 10,
        },
        {
          caracteristica: 'Reclamaciones',
          pregunta:
            '¿El proveedor soluciona oportunamente las no conformidades de calidad y gestión de los bienes o servicios recibidos?',
          porcentaje: 10,
        },
        {
          caracteristica: 'Servicio post venta',
          pregunta:
            '¿El proveedor cumple con los compromisos pactados dentro del contrato u orden de servicios o compra? (aplicación, garantía, mantenimiento, cambios, reparaciones, capacitaciones, entre otras)',
          porcentaje: 10,
        },
      ],
    },
    {
      elemento: 'Gestión',
      preguntas: [
        {
          caracteristica: 'Procedimientos',
          pregunta:
            '¿El contrato es suscrito en el tiempo pactado, entrega las pólizas a tiempo, entrega el informe de ejecución y las facturas son radicadas en el tiempo indicado con las condiciones y soportes requeridos para su trámite contra actual?',
          porcentaje: 10,
        },
        {
          caracteristica: 'Garantía',
          pregunta:
            '¿Se requirió hacer uso de la garantía del producto o servicio?',
          porcentaje: 10,
        },
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
    console.log(this.evaluacion.value);

    const respuestas = this.evaluacion.get('respuestas') as FormArray;
    respuestas.valueChanges.subscribe(() => {
      this.porcentage = this.sumarPorcentajes();
    });
  
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
