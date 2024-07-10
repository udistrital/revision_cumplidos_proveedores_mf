import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cargar-modal',
  templateUrl: './cargar-modal.component.html',
  styleUrls: ['./cargar-modal.component.css']
})
export class CargarModalComponent {

  constructor(public dialogRef: MatDialogRef<CargarModalComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}


