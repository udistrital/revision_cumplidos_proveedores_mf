import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ver-soporte-modal',
  templateUrl: './ver-soporte-modal.component.html',
  styleUrls: ['./ver-soporte-modal.component.css']
})
export class VerSoporteModalComponent {

  pdfSrc: string;

  constructor(
    public dialogRef: MatDialogRef<VerSoporteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { fileURL: string },
  ) {
    this.pdfSrc = data.fileURL;
  }

  close(): void {
    this.dialogRef.close();
  }
}
