import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { Button } from 'src/app/models/button.model';
import { ModalSoportesCumplidoData,Mode, RolUsuario } from 'src/app/models/modal-soporte-cumplido-data.model';
import { CambioEstadoCumplido } from 'src/app/models/revision_cumplidos_proveedores_crud/cambio-estado-cumplio.model';
import { CumplidosProveedoresCrudService } from 'src/app/services/cumplidos_proveedores_crud.service';
import { SoportesService } from 'src/app/services/soportes.service';
import { InformacionSoporteCumplido } from 'src/app/models/revision_cumplidos_proveedores_mid/informacion_soporte_cumplido.model';


@Component({
  selector: 'app-modal-soportes-cumplido',
  templateUrl: './modal-soportes-cumplido.component.html',
  styleUrls: ['./modal-soportes-cumplido.component.scss'],
})
export class ModalSoportesCumplidoComponent {
  soportes!: InformacionSoporteCumplido[];
  cumplidoProveedorId!:number;
  cambioEstadoCumplido!:CambioEstadoCumplido;
  loading: boolean = true;
  mode=Mode;
  rolUsuario=RolUsuario;
  buttons!:Button[];
  modalButtonsFunc!:Button[];


  constructor(
    public dialogRef: MatDialogRef<ModalSoportesCumplidoComponent>,
    private cumplidos_provedore_crud_service:CumplidosProveedoresCrudService,
    private soporteService: SoportesService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: ModalSoportesCumplidoData
  ) {}

  ngOnInit() {
    this.buttons=this.data.Buttons
    this.modalButtonsFunc=this.data.ModalButtonsFunc
    this.cumplidoProveedorId=this.data.CumplidoProveedorId
    this.cargarSoportes()
  }

  cargarSoportes() {
    console.log(this.data)
    this.soporteService.getDocumentosCumplidos(this.cumplidoProveedorId).subscribe({
      next: (soportes: InformacionSoporteCumplido[]) => {
        this.soportes = soportes;
        console.log(this.soportes);
      },
      error: (error: any) => {
        console.log(error)
        this.soportes=[]
       // this.popUpManager.showErrorAlert(
     //     'Por el momento, no hay soportes subidos para esta solicitud de pago.'
      //  );
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }


}
