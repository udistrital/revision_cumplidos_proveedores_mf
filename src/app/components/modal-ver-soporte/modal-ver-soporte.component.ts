import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AletManagerService } from 'src/app/managers/alet-manager.service';
import { SolicituDeFirma } from 'src/app/models/certificado-pago';
import { TokenService } from 'src/app/utils.ts/info_token';
import { FirmaElectronicaService } from 'src/app/services/firma_electronica_mid.service';
import { CumplidosProveedoresCrudService } from 'src/app/services/cumplidos_proveedores_crud.service';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import Swal from 'sweetalert2';

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
  autorizacionPago:SolicituDeFirma;
  tipoDocumento:number
  payload = TokenService.getPayload();
  cargoResponsable:string;

  constructor(public dialogRef:MatDialogRef<ModalVerSoporteComponent>,
    private alertService: AletManagerService,
    public dialog: MatDialog,
    private firmaElectronica:FirmaElectronicaService,
    private cumplidos_provedore_crud_service:CumplidosProveedoresCrudService,
    private cumplidos_provedore_mid_service:CumplidosProveedoresMidService,
    @Inject(MAT_DIALOG_DATA) public data: { documentoAFirmar:SolicituDeFirma ,
      cargoResponsable:string, aprobarSoportes:boolean,idCumplido:number,base64:string, tipoDocumento:number,funcionAprobar: (id: number) => void;  } 

  ) {
    this.cargoResponsable=data.cargoResponsable;
    this.base64=data.base64
    this.autorizacionPago=data.documentoAFirmar;
    this.idCumplido = data.idCumplido != null ? data.idCumplido : 0;
    if(this.autorizacionPago==null){
      this.pdfSrc = `data:application/pdf;base64,${data.base64}`;
    }else{
      this.pdfSrc = `data:application/pdf;base64,${data.documentoAFirmar.Archivo}`;
    }
    this.aprobarSoportes=data.aprobarSoportes!=null? data.aprobarSoportes: false;
    this.tipoDocumento=data.tipoDocumento
  
  }

  aprobarContratacion() {
    if (typeof this.data.funcionAprobar === 'function') {
      this.data.funcionAprobar(this.idCumplido);
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
    console.log(this.autorizacionPago)
    const documentosAFirmarArray = [
      {
        IdTipoDocumento: this.tipoDocumento, 
        nombre: this.autorizacionPago.NombreArchivo,
        metadatos: {observaciones:`documento de pago para el proveedor ${this.autorizacionPago.NombreArchivo}`}, 
        firmantes: [
          {
            nombre: this.autorizacionPago.NombreResponsable,
            cargo: this.cargoResponsable,
            tipoId: this.payload?.documento_compuesto.replace(/[^A-Za-z]/g, ''),
            identificacion: this.payload?.documento,
          }
        ], 
        representantes: [],
        descripcion: this.autorizacionPago.DescripcionDocumento,
        file: this.autorizacionPago.Archivo
      }
    ];

   this.alertService.showLoadingAlert("Firmando", "Espera mientras el documento se firma")

     this.firmaElectronica.post("/firma_electronica",documentosAFirmarArray)
     .subscribe(
      (response:any)=>{
        
        if(response && response.res){
        Swal.close();
        this.aprobarContratacion();
        this.registarSoportePagoFirmado(response.res)
      
        }
       
      },
      error=>{
        console.log(error)
      }
            
     );

      }

      registarSoportePagoFirmado(respuesta: any) {

        this.alertService.showLoadingAlert("Cargando", "Espera mientras el documento se carga")
          const documento = {
            DocumentoId: respuesta.Id,
            CumplidoProveedorId: { id: this.idCumplido },
          };
          this.cumplidos_provedore_crud_service.post("/soporte_cumplido", documento).subscribe(
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
          
            const response: any = await this.cumplidos_provedore_mid_service.get(`/solicitud-pago/soportes/${this.idCumplido}`).toPromise();
            console.log('Respuesta completa:', response);
        
  
            const documentoFiltrado = response.Data.find((item: any) => item.Documento.Id === idDocumento);
        
            if (documentoFiltrado) {
                this.base64 = documentoFiltrado.Archivo.File;
                if (this.dialogRef) {
                  this.dialogRef.close();
                }
                Swal.close()
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
    



    
       
      



    


  




