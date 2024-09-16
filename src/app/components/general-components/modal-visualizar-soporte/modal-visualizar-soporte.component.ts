import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-visualizar-soporte',
  templateUrl: './modal-visualizar-soporte.component.html',
  styleUrls: ['./modal-visualizar-soporte.component.scss'],
})
export class ModalVisualizarSoporteComponent {
  documentLoad:boolean=false
  documentData:string

  constructor(
    public dialogRef: MatDialogRef<ModalVisualizarSoporteComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) {
    this.documentLoad=false
    this.documentData='data:application/pdf;base64,'+this.data.url

    console.log("Data ", this.data)
    console.log(this.documentData)
  }

  ngOnInit() {
    if(this.data.url){
      this.documentLoad=true
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
