import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Button } from 'src/app/models/button.model';

@Component({
  selector: 'app-modal-visualizar-soporte',
  templateUrl: './modal-visualizar-soporte.component.html',
  styleUrls: ['./modal-visualizar-soporte.component.scss'],
})
export class ModalVisualizarSoporteComponent {
  documentLoad:boolean=false
  documentData:string
  modalButtonsFunc:Button[]
  bunttonClose:Button

  constructor(
    public dialogRef: MatDialogRef<ModalVisualizarSoporteComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) {
    this.documentLoad=false
    this.documentData='data:application/pdf;base64,'+this.data.url
    this.modalButtonsFunc= this.data.ModalButtonsFunc
    this.bunttonClose=this.data.BunttonClose;

  
  }

  ngOnInit() {
    if(this.data.url){
      this.documentLoad=true
    }
  }

  public close(): void {
    this.dialogRef.close();
  }
}
