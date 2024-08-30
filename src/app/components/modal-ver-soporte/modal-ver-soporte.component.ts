import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AletManagerService } from 'src/app/managers/alert-manager.service'; 
import { SolicituDeFirma } from 'src/app/models/certificado-pago.model';
import { TokenService } from 'src/app/utils.ts/info_token';
import { FirmaElectronicaService } from 'src/app/services/firma_electronica_mid.service';
import { CumplidosProveedoresCrudService } from 'src/app/services/cumplidos_proveedores_crud.service';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import Swal from 'sweetalert2';
import { CargarModalComponent } from '../subir_soporte/cargar-modal/cargar-modal.component';
import { Router } from '@angular/router';
import { ModalCargaSoprotesComponent } from '../carga-soportes/modal-carga-soprotes/modal-carga-soprotes.component';

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
  regresarACargaDocumentos:boolean;
  cumplido:any
  documentoResponsable:string
  estadoCumplido:string

  constructor(public dialogRef:MatDialogRef<ModalVerSoporteComponent>,
    private alertService: AletManagerService,
    public dialog: MatDialog,
    private firmaElectronica:FirmaElectronicaService,
    private cumplidos_provedore_crud_service:CumplidosProveedoresCrudService,
    private cumplidos_provedore_mid_service:CumplidosProveedoresMidService,
    private router:Router,
    @Inject(MAT_DIALOG_DATA) public data: { documentoAFirmar:SolicituDeFirma ,

      cargoResponsable:string, aprobarSoportes:boolean,idCumplido:number,base64:string, cumplido:any , regresarACargaDocumentos:boolean,
      tipoDocumento:number,funcionAprobar: (id: number,esatadoCumplido:string, documentoResponsable:string, cargoResponsable:string) => void,estadoCumplido:string,documentoResponsable:string; }  

  ) {
    this.cargoResponsable=data.cargoResponsable;
    this.cumplido =data.cumplido
    this.base64=data.base64
    this.estadoCumplido = data.estadoCumplido
    this.regresarACargaDocumentos= data.regresarACargaDocumentos
    this.documentoResponsable=data.documentoResponsable
    console.log("this.registarSoportePagoFirmado")
    console.log("registarSoportePagoFirmado")
    console.log(this.regresarACargaDocumentos)
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
    console.log("ssientro");
    if (typeof this.data.funcionAprobar === 'function') {
      console.log(this.idCumplido,this.estadoCumplido ,this.documentoResponsable,this.cargoResponsable)
      this.data.funcionAprobar(this.idCumplido,this.estadoCumplido,this.documentoResponsable, this.cargoResponsable );
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


   async firmarDocumento(){


console.log(this.autorizacionPago.NombreResponsable)
      const confirm = await this.alertService.alertConfirm("¿Estas seguro de firmar el documento?");
      if(confirm.isConfirmed){

        console.log(this.tipoDocumento)
        console.log("",this.autorizacionPago.NombreArchivo)
        console.log("nombre archivo",this.autorizacionPago.NombreArchivo)
        console.log("nombre responsable ",this.autorizacionPago.NombreResponsable)
    
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
      }else{
        this.alertService.showCancelAlert("Cancelado","No se firmo el documento")
      }

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
            console.log(this.registarSoportePagoFirmado);
  
            const documentoFiltrado = response.Data.find((item: any) => item.Documento.Id === idDocumento);
        
            if (documentoFiltrado) {
                this.base64 = documentoFiltrado.Archivo.File;
                if (this.dialogRef) {
                  this.dialogRef.close();
                }
                Swal.close()
                this.openVerSoporte(this.idCumplido);
                if(this.regresarACargaDocumentos != undefined && !this.regresarACargaDocumentos){
                      this.regresarACargaDocumentos=true;
                }
            }
        } catch (error) {
            console.error('Error al obtener los documentos', error);
        }
        console.log(this.registarSoportePagoFirmado);
    }
    
    openVerSoporte(idCumplido: number) {
        
        
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
                regresarACargaDocumentos:this.registarSoportePagoFirmado
                
            },
        });
    }

    openCargarSoportes() {
     this.router.navigate(['/supervisor/subir-soportes']).then(()=>{
      const dialogRef = this.dialog.open(ModalCargaSoprotesComponent, {
        width: '53%',
        height: '70%',
        panelClass: 'custom-dialog-container',
        data:{
          cumplido:this.cumplido
        }
      });
      dialogRef.afterClosed().subscribe(result => {
  
      });
     });
 
     
      
    }
    }
    



    
       
      



    


  




