import { Component } from '@angular/core';

@Component({
  selector: 'app-card-pregunta',
  templateUrl: './card-pregunta.component.html',
  styleUrls: ['./card-pregunta.component.scss'],
})
export class CardPreguntaComponent {
  porcentage:number=0;
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


  
   sumarPorcentajes() {

    this.listaPreguntas.forEach(item => {
        item.preguntas.forEach(pregunta => {
            this.porcentage += pregunta.porcentaje;
        });
    });

}
}


