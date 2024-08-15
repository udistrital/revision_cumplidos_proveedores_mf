import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AletManagerService } from 'src/app/managers/alet-manager.service';
import { GeneralService } from 'src/app/services/generalService.service';
import { Cumplido } from 'src/app/models/cumplido';

@Component({
  selector: 'app-modal-ver-soportes',
  templateUrl: './modal-ver-soporte.component.html',
  styleUrls: ['./modal-ver-soporte.component.css']
})
export class ModalVerSoporteComponent  {
 
  
  pdfSrc: string;
  aprobarSoportes:boolean;
  idCumplido:number
  archivoBase64:string;


  constructor(public dialogRef:MatDialogRef<ModalVerSoporteComponent>,
    private alertService: AletManagerService,
    private generalService:GeneralService,
    @Inject(MAT_DIALOG_DATA) public data: { base64: string , aprobarSoportes:boolean,idCumplido:number, funcionAprobar: (id: number, base64: string) => void; } 

  ) {
    this.archivoBase64=data.base64;
    this.idCumplido = data.idCumplido != null ? data.idCumplido : 0;
    this.pdfSrc = `data:application/pdf;base64,${data.base64}`;
    this.aprobarSoportes=data.aprobarSoportes!=null? data.aprobarSoportes: false;
    if(this.aprobarSoportes){
      console.log("true")
    }
  }

  aprobarContratacion() {
    if (typeof this.data.funcionAprobar === 'function') {
      this.data.funcionAprobar(this.idCumplido, this.pdfSrc);
    }
    this.dialogRef.close()
  }

  cerraDialog(){
    this.dialogRef.close()
    this.alertService.showCancelAlert(
      'Rechazado',
      '!Se rechazado la  aprobacion del soporte!'
    );
  }



}


