import { Component } from '@angular/core';
import { Soporte } from 'src/app/models/soporte.model';

@Component({
  selector: 'app-visualizar-soportes',
  templateUrl: './visualizar-soportes.component.html',
  styleUrls: ['./visualizar-soportes.component.css']
})
export class VisualizarSoportesComponent {
  tittle = 'VER SOPORTES'

  soportes: Soporte[] = [
    {
      nombre: 'Informe de seguimiento',
      fecha: new Date(),
      item: 'INFORME DE SEGUIMIENTO',
      comentario: 'Comentario de informe.'
    },
    {
      nombre: 'Evaluación proovedores',
      fecha: new Date(),
      item: 'EVALUACIÓN PROOVEDORES',
      comentario: 'Comentario Evaluación proveedores.'
    },
    {
      nombre: 'Acta de inicio',
      fecha: new Date(),
      item: 'OTROS',
      comentario: 'Comentario del documento subido en otros.'
    }
  ]
}
