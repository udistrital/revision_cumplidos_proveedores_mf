import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'proveedores1',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'revision_cumplidos_proveedores_mf';

  constructor(public dialog: MatDialog) {}

}
