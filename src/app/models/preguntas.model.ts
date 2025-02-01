export interface Preguntas {
  elemento: string;
  valorSeccion: number,
  preguntas: Pregunta[];
}

export interface Pregunta {
  titulo: string;
  pregunta: string;
  valorAsignado: { cumplimiento: string; valor: number }[];
  index: number;
  opcionSeleccionada: string;
  valorSeleccionado: number; 
  visible: boolean;
}

export const FormularioPreguntas: Preguntas[] = [
    {
      elemento: 'Cumplimiento',
      valorSeccion: 0,
      preguntas: [
        {
          titulo: 'Tiempos de entrega',
          pregunta: '¿Se cumplieron los tiempos de entrega de bienes o la prestación del servicios ofertados por el proveedor?',
          valorAsignado: [
            { cumplimiento: 'SI', valor: 12 },
            { cumplimiento: 'NO', valor: 0 }
          ],
          index: 0,
          opcionSeleccionada: 'NO',
          valorSeleccionado: 0,
          visible: true, 
        },
        {
          titulo: 'Cantidades',
          pregunta: '¿Se entregan las cantidades solicitadas?',
          valorAsignado: [
            { cumplimiento: 'SI', valor: 12 },
            { cumplimiento: 'NO', valor: 0 }
          ],
          index: 1,
          opcionSeleccionada: 'NO',
          valorSeleccionado: 0,
          visible: true, 
        },
      ],
    },
    {
      elemento: 'Calidad',
      valorSeccion: 0,
      preguntas: [
        {
          titulo: 'Conformidad',
          pregunta: '¿El bien o servicio cumplió con las especificaciones y requisitos pactados en el momento de entrega?',
          valorAsignado: [
            { cumplimiento: 'SI', valor: 20 },
            { cumplimiento: 'NO', valor: 0 }
          ],
          index: 2,
          opcionSeleccionada: 'NO',
          valorSeleccionado: 0,
          visible: true, 
        },
        {
          titulo: 'Funcionalidad adicional',
          pregunta: '¿El producto comprado o el servicio prestado proporcionó más herramientas o funciones de las solicitadas originalmente?',
          valorAsignado: [
            { cumplimiento: 'SI', valor: 10 },
            { cumplimiento: 'NO', valor: 0 }
          ],
          index: 3,
          opcionSeleccionada: 'NO',
          valorSeleccionado: 0,
          visible: true, 
        },
      ],
    },
    {
      elemento: 'Pos contractual',
      valorSeccion: 0,
      preguntas: [
        {
          titulo: 'Reclamaciones',
          pregunta: '¿Se han presentado reclamaciones al proveedor en calidad o gestión?',
          valorAsignado: [
            { cumplimiento: 'SI', valor: 0 },
            { cumplimiento: 'NO', valor: 12 }
          ],
          index: 4,
          opcionSeleccionada: 'SI',
          valorSeleccionado: 0,
          visible: true, 
        },
        {
          titulo: 'Reclamaciones',
          pregunta: '¿El proveedor soluciona oportunamente las no conformidades de calidad y gestión de los bienes o servicios recibidos?',
          valorAsignado: [
            { cumplimiento: 'SI', valor: 12 },
            { cumplimiento: 'NO', valor: 0 }
          ],
          index: 5,
          opcionSeleccionada: 'NO',
          valorSeleccionado: 0,
          visible: false, 
        },
        {
          titulo: 'Servicio pos venta',
          pregunta: '¿El proveedor cumple con los compromisos pactados dentro del contrato u orden de servicio o compra? (aplicación de garantías, mantenimiento, cambios, reparaciones, capacitaciones, entre otras)',
          valorAsignado: [
            { cumplimiento: 'SI', valor: 10 },
            { cumplimiento: 'NO', valor: 0 }
          ],
          index: 6,
          opcionSeleccionada: 'NO',
          valorSeleccionado: 0,
          visible: true, 
        },
      ],
    },
    {
      elemento: 'Gestión',
      valorSeccion: 0,
      preguntas: [
        {
          titulo: 'Procedimientos',
          pregunta: '¿El contrato es suscrito en el tiempo pactado, entrega las pólizas a tiempo y las facturas son radicadas en el tiempo indicado con las condiciones y soportes requeridos para su trámite contractual?',
          valorAsignado: [
            { cumplimiento: 'EXCELENTE', valor: 9 },
            { cumplimiento: 'BUENO', valor: 6 },
            { cumplimiento: 'REGULAR', valor: 3 },
            { cumplimiento: 'MALO', valor: 0 }
          ],
          index: 7,
          opcionSeleccionada: 'MALO',
          valorSeleccionado: 0,
          visible: true, 
        },
        {
          titulo: 'Garantía',
          pregunta: '¿Se requirió hacer uso de la garantía del producto o servicio?',
          valorAsignado: [
            { cumplimiento: 'SI', valor: 0 },
            { cumplimiento: 'NO', valor: 15 }
          ],
          index: 8,
          opcionSeleccionada: 'SI',
          valorSeleccionado: 0,
          visible: true, 
        },
        {
          titulo: 'Garantía',
          pregunta: '¿El proveedor cumplió a satisfacción con la garantía pactada?',
          valorAsignado: [
            { cumplimiento: 'SI', valor: 15 },
            { cumplimiento: 'NO', valor: 0 }
          ],
          index: 9,
          opcionSeleccionada: 'NO',
          valorSeleccionado: 0,
          visible: false, 
        },
      ],
    },
  ];