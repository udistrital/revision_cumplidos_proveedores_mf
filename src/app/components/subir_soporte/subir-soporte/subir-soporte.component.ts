import { Component } from '@angular/core';

@Component({
  selector: 'app-subir-soporte',
  templateUrl: './subir-soporte.component.html',
  styleUrls: ['./subir-soporte.component.css']
})
export class SubirSoporteComponent {

  opcionSeleccionada = '';
  opciones = [
    { value: 1, viewValue: 'Informe de seguimiento' },
    { value: 2, viewValue: 'Evaluacion proovedores' },
    { value: 3, viewValue: 'Acta de inicio' },
    { value: 4, viewValue: 'Otros' },
  ]
  observaciones = '';
}
