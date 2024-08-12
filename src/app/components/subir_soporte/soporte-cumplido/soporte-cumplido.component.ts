import { Component, Input } from '@angular/core';
import { Soporte } from 'src/app/models/soporte.model';
import { VerSoporteModalComponent } from '../ver-soporte-modal/ver-soporte-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { SoportesServicesService } from 'src/app/services/soportes.services.service';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { UtilsService } from 'src/app/services/utils.service';

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
    private utilsService: UtilsService
  ){

  }

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

  getDocument(documentBase64: string, nameWindow: string) {
    const arrayBuffer = this.utilsService.base64ToArrayBuffer(documentBase64);
    const file = new Blob([arrayBuffer], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);

    /*
    const dialogRef = this.dialog.open(VerSoporteModalComponent, {
      width: '53%',
      height: '70%',
      panelClass: 'custom-dialog-container',
      data: { fileURL: fileURL }
    });

    */

    window.open(
      fileURL,
      nameWindow,
      "resizable=yes,status=no,location=no,toolbar=no,menubar=no,fullscreen=yes,scrollbars=yes,dependent=no,width=800,height=900"
    );

  }

  eliminarSoporte(soporte: any){
    console.log(soporte)
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

  }

}
