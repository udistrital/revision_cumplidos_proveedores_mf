import { Component, Input } from '@angular/core';
import { Soporte } from 'src/app/models/soporte.model';
import { VerSoporteModalComponent } from '../ver-soporte-modal/ver-soporte-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { SoportesServicesService } from 'src/app/services/soportes.services.service';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ModalVerSoporteComponent } from '../../modal-ver-soporte/modal-ver-soporte.component';
import { AletManagerService } from 'src/app/managers/alert-manager.service';

@Component({
  selector: 'app-soporte-cumplido',
  templateUrl: './soporte-cumplido.component.html',
  styleUrls: ['./soporte-cumplido.component.css']
})
export class SoporteCumplidoComponent {

  soportes: Soporte[] = []
  solicitudPago!: number;

  constructor(
    public dialog: MatDialog,
    private popUpManager: PopUpManager,
    private soporteService: SoportesServicesService,
    private cumplidosMidServices: CumplidosProveedoresMidService,
    private utilsService: UtilsService,
    private aletManagerService:AletManagerService,
  ){

  }

  listaSoportes: Soporte[] = [
    {
      Id: 1,
      nombre: "Soporte 1",
      fecha: "2024-09-05",
      item: "Item A",
      comentario: "Este es un comentario para el Soporte 1",
      archivo: "soporte1.pdf"
    },
    {
      Id: 2,
      nombre: "Soporte 2",
      fecha: "2024-09-05",
      item: "Item B",
      comentario: "Comentario del Soporte 2",
      archivo: "soporte2.doc"
    },
    {
      Id: 3,
      nombre: "Soporte 3",
      fecha: "2024-09-05",
      item: "Item C",
      comentario: "Comentario breve",
      archivo: "soporte3.txt"
    }
  ];

  ngOnInit() {
    this.cumplidosMidServices.cumplido$.subscribe(cumplido => {
      if (cumplido) {
        this.solicitudPago = cumplido.cumplidoProveedor.Id;
      }
    })

    this.cargarSoportes(this.solicitudPago);

  }

  cargarSoportes(cumplido_proveedor: number) {
    this.soporteService.getDocumentosCumplidos(cumplido_proveedor)
      .subscribe({
        next: (soportes: Soporte[]) => {
          this.soportes = soportes;
          console.log(this.soportes)
        },
        error: (error: any) => {
          this.popUpManager.showErrorAlert('Por el momento no hay soportes subidos para esta solicitud de pago');
        }
      });
  }



  openVerSoporte(pdfBase64: string) {
    this.dialog.open(ModalVerSoporteComponent, {
      disableClose: true,
      height: '70vh',
      width: '50vw',
      maxWidth: '60vw',
      maxHeight: '80vh',
      panelClass: 'custom-dialog-container',
      data: { base64: pdfBase64 }
    });
  }




  async eliminarSoporte(soporte: any){
 
       const confirm = await this.aletManagerService.alertConfirm("¿Deseas Eliminar el soporte?","Esta opccion no es reversive");
       if(confirm.isConfirmed){
        
        console.log(soporte)
        try{
          this.cumplidosMidServices.delete(`/solicitud-pago/soportes`, soporte)
        .subscribe({
          next: (res: any) => {
            this.popUpManager.showSuccessAlert('Soporte eliminado correctamente');
            this.cargarSoportes(this.solicitudPago);
          },
          error: (error: any) => {
            this.popUpManager.showErrorAlert('No fue posible eliminar el soporte');
          }
        });
        }catch(error){
            this.aletManagerService.showCancelAlert("Error","Se produjo"+error)
        }
        
       }else{
        this.aletManagerService.showCancelAlert("Cancelado","No se elimino")
       }
  }

  
}
