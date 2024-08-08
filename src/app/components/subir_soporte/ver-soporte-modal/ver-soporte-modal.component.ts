import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-ver-soporte-modal',
  templateUrl: './ver-soporte-modal.component.html',
  styleUrls: ['./ver-soporte-modal.component.css']
})
export class VerSoporteModalComponent {

  pdfSrc: SafeResourceUrl;

  constructor(
    public dialogRef: MatDialogRef<VerSoporteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { base64: string, fileName: string },
    private sanitizer: DomSanitizer
  ) {
    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`data:application/pdf;base64,${data.base64}`);
  }

  close(): void {
    this.dialogRef.close();
  }
}
