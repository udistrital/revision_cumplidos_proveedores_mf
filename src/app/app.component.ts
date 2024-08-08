import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CargarModalComponent } from './components/subir_soporte/cargar-modal/cargar-modal.component';


@Component({
  selector: 'proveedores1',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'revision_cumplidos_proveedores_mf';

  constructor(public dialog: MatDialog) {}

}
