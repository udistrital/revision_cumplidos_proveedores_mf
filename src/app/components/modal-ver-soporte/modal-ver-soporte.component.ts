import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AletManagerService } from 'src/app/managers/alet-manager.service';
import { GeneralService } from 'src/app/services/generalService.service';
import { Cumplido } from 'src/app/models/cumplido';
import { CertificadoPago } from 'src/app/models/certificado-pago';
import { Documento } from './../../models/soporte_cumplido';
import { Service } from './../../services/service.service';

@Component({
  selector: 'app-modal-ver-soportes',
  templateUrl: './modal-ver-soporte.component.html',
  styleUrls: ['./modal-ver-soporte.component.css']
})
export class ModalVerSoporteComponent  {
 
  private currentDialogRef: MatDialogRef<ModalVerSoporteComponent> | null = null;
  pdfSrc: string;
  base64 :string
  aprobarSoportes:boolean;
  idCumplido:number
  autorizacionPago:CertificadoPago;
  tipoDocumento:number


  constructor(public dialogRef:MatDialogRef<ModalVerSoporteComponent>,
    private alertService: AletManagerService,
    public dialog: MatDialog,
    private generalService:Service,
    @Inject(MAT_DIALOG_DATA) public data: { autorizacionPago: CertificadoPago , aprobarSoportes:boolean,idCumplido:number,base64:string, tipoDocumento:number,funcionAprobar: (id: number, base64: string) => void;  } 

  ) {
    this.base64=data.base64
    this.autorizacionPago=data.autorizacionPago;
    this.idCumplido = data.idCumplido != null ? data.idCumplido : 0;
    if(this.autorizacionPago==null){
      this.pdfSrc = `data:application/pdf;base64,${data.base64}`;
    }else{
      this.pdfSrc = `data:application/pdf;base64,${data.autorizacionPago.Archivo}`;
    }
    this.aprobarSoportes=data.aprobarSoportes!=null? data.aprobarSoportes: false;
    this.tipoDocumento=data.tipoDocumento
  
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


   firmarDocumento(){
    const documentosAFirmarArray = [
      {
        IdTipoDocumento: this.tipoDocumento, 
        nombre: this.autorizacionPago.NombreArchivo,
        metadatos: {observaciones:`documento de pago para el proveedor ${this.autorizacionPago.NombreArchivo}`}, 
        firmantes: [
          {
            nombre: this.autorizacionPago.NombreResponsable,
            cargo: "Ordenador del gasto",
            tipoId: "cc",
            identificacion: "1111111"
          }
        ], 
        representantes: [],
        descripcion: this.autorizacionPago.DescripcionDocumento,
        file: this.autorizacionPago.Archivo
      }
    ];
    
    

     this.generalService.postFirmaElectronica("/firma_electronica",documentosAFirmarArray)
     .subscribe(
      (response:any)=>{
        
        if(response && response.res){
        
        this.registarSoportePagoFirmado(response.res)
      
        }
       
      },
      error=>{
        console.log(error)
      }
            
     );

      }
  


      registarSoportePagoFirmado(respuesta: any) {

          const documento = {
            DocumentoId: respuesta.Id,
            CumplidoProveedorId: { id: this.idCumplido },
          };
          this.generalService.postCumplidosProveedoresCrud("/soporte_cumplido", documento).subscribe(
            response => {
             this.buscarSoporteFirmado(respuesta.Id);
            },
            error => {
              console.error('Error al registrar soporte de pago:', error);
    
            }
          );

      }
      async buscarSoporteFirmado(idDocumento: number) {
        try {
          
            const response: any = await this.generalService.get(`/solicitud-pago/soportes/${this.idCumplido}`).toPromise();
            console.log('Respuesta completa:', response);
        
  
            const documentoFiltrado = response.Data.find((item: any) => item.Documento.Id === idDocumento);
        
            if (documentoFiltrado) {
                this.base64 = documentoFiltrado.Archivo.File;
                if (this.dialogRef) {
                  this.dialogRef.close();
                }
                this.openVerSoporte(this.idCumplido);
            }
        } catch (error) {
            console.error('Error al obtener los documentos', error);
        }
    }
    
    openVerSoporte(idCumplido: number) {
        console.log(this.base64);
        
        this.dialog.open(ModalVerSoporteComponent, {
            disableClose: true,
            height: '70vh',
            width: '40vw',
            maxWidth: '60vw',
            maxHeight: '80vh',
            panelClass: 'custom-dialog-container',
            data: {
                aprobarSoportes: false,
                idCumplido: idCumplido,
                tipoDocumento: 168,
                base64: this.base64, 
            },
        });
    }
    }
    



    
       
      



    


  




