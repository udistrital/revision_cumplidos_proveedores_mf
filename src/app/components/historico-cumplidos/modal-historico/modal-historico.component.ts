import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalSoportesCumplidoData } from 'src/app/models/modal-soporte-cumplido-data.model';
import { CambioEstadoCumplido } from 'src/app/models/revision_cumplidos_proveedores_crud/cambio-estado-cumplio.model';
import { InformacionSoporteCumplido } from 'src/app/models/revision_cumplidos_proveedores_mid/informacion_soporte_cumplido.model';

@Component({
  selector: 'app-modal-historico',
  templateUrl: './modal-historico.component.html',
  styleUrls: ['./modal-historico.component.css'],
})
export class ModalHistoricoComponent {

  constructor(public dialogRef: MatDialogRef<ModalHistoricoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalSoportesCumplidoData){}

    cambioEstadoCumplido!:CambioEstadoCumplido;
  Estados = [
    {
      nombre: 'John Smith',
      estado: 'Embarca en el Mayflower',
      fecha: '1620-09-16',
      cargo: 'Pilgrim Leader',
    },
    {
      nombre: 'Elizabeth Bennett',
      estado: "Publicación de 'Orgullo y Prejuicio'",
      fecha: '1813-01-28',
      cargo: 'Novelista',
    },
    {
      nombre: 'Leonardo da Vinci',
      estado: "Pintura de 'La Mona Lisa'",
      fecha: '1503-06-01',
      cargo: 'Artista e inventor',
    },
    {
      nombre: 'Amelia Earhart',
      estado: 'Primer vuelo transatlántico por una mujer',
      fecha: '1932-05-20',
      cargo: 'Aviadora',
    },
    {
      nombre: 'Nelson Mandela',
      estado: 'Libertad tras 27 años de prisión',
      fecha: '1990-02-11',
      cargo: 'Activista político',
    },
  ];

  listaSoporteCumplido: InformacionSoporteCumplido[] = [
    {
      SoporteCumplidoId: 1,
      Documento: {
        Id: 101,
        Nombre: 'Informe de soporte',
        TipoDocumento: 'PDF',
        Descripcion: 'Informe mensual de soporte técnico.',
        Observaciones: 'Ninguna',
        FechaCreacion: '2023-09-01',
      },
      Archivo: {
        File: '/archivos/informe_soporte.pdf',
      },
      Comentarios: [],
    },
    {
      SoporteCumplidoId: 2,
      Documento: {
        Id: 102,
        Nombre: 'Acta de reunión',
        TipoDocumento: 'DOCX',
        Descripcion: 'Acta de la reunión de soporte.',
        Observaciones: 'Revisar los puntos tratados.',
        FechaCreacion: '2023-09-05',
      },
      Archivo: {
        File: '/archivos/acta_reunion.docx',
      },
      Comentarios: [],
    },
    {
      SoporteCumplidoId: 3,
      Documento: {
        Id: 103,
        Nombre: 'Reporte de incidentes',
        TipoDocumento: 'CSV',
        Descripcion: 'Reporte de incidentes del mes.',
        Observaciones: 'Urgente.',
        FechaCreacion: '2023-09-10',
      },
      Archivo: {
        File: '/archivos/reporte_incidentes.csv',
      },
      Comentarios: [],
    },
    {
      SoporteCumplidoId: 4,
      Documento: {
        Id: 104,
        Nombre: 'Evaluación de soporte',
        TipoDocumento: 'XLSX',
        Descripcion: 'Evaluación trimestral de soporte técnico.',
        Observaciones: 'Enviar a todos los responsables.',
        FechaCreacion: '2023-09-15',
      },
      Archivo: {
        File: '/archivos/evaluacion_soporte.xlsx',
      },
      Comentarios: [],
    },
    {
      SoporteCumplidoId: 5,
      Documento: {
        Id: 105,
        Nombre: 'Plan de acción',
        TipoDocumento: 'PDF',
        Descripcion: 'Plan de acción para el próximo mes.',
        Observaciones: 'Revisar fechas de entrega.',
        FechaCreacion: '2023-09-20',
      },
      Archivo: {
        File: '/archivos/plan_accion.pdf',
      },
      Comentarios: [],
    },
    {
      SoporteCumplidoId: 6,
      Documento: {
        Id: 106,
        Nombre: 'Informe final de proyecto',
        TipoDocumento: 'DOCX',
        Descripcion: 'Informe final del proyecto de soporte.',
        Observaciones: 'Aprobación final requerida.',
        FechaCreacion: '2023-09-25',
      },
      Archivo: {
        File: '/archivos/informe_final_proyecto.docx',
      },
      Comentarios: [],
    },
  ];
}
