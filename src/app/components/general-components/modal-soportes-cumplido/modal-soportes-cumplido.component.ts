import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { CambioEstadoCumplido } from 'src/app/models/basics/cambio-estado-cumplio.model';
import { ModalSoportesCumplidoData,Mode } from 'src/app/models/modal-soporte-cumplido-data.model';
import { SoporteCumplido } from 'src/app/models/soporte_cumplido.model';
import { CumplidosProveedoresCrudService } from 'src/app/services/cumplidos_proveedores_crud.service';
import { SoportesService } from 'src/app/services/soportes.service';

@Component({
  selector: 'app-modal-soportes-cumplido',
  templateUrl: './modal-soportes-cumplido.component.html',
  styleUrls: ['./modal-soportes-cumplido.component.css'],
})
export class ModalSoportesCumplidoComponent {
  soportes!: SoporteCumplido[];
  cumplidoProveedorId!:number;
  cambioEstadoCumplido!:CambioEstadoCumplido;
  mode=Mode

  constructor(
    public dialogRef: MatDialogRef<ModalSoportesCumplidoComponent>,
    private cumplidos_provedore_crud_service:CumplidosProveedoresCrudService,
    private soporteService: SoportesService,
    private popUpManager: PopUpManager,
    @Inject(MAT_DIALOG_DATA) public data: ModalSoportesCumplidoData
  ) {}

  ngOnInit() {
    
    this.cumplidoProveedorId=this.data.CumplidoProveedorId
    console.log(this.soportes)
    this.cargarSoportes()
    this.ObtenerUltimoCambioEstado()
  }

  cargarSoportes() {
    console.log(this.data)
    this.soporteService.getDocumentosCumplidos(this.cumplidoProveedorId).subscribe({
      next: (soportes: SoporteCumplido[]) => {
        this.soportes = soportes;
        console.log(this.soportes);
      },
      error: (error: any) => {
        console.log(error)
        this.soportes=[]
        // this.popUpManager.showErrorAlert(
        //   'Por el momento no hay soportes subidos para esta solicitud de pago'
        // );
      },
    });
  }

  ObtenerUltimoCambioEstado(){
    console.log(this.cambioEstadoCumplido)
    this.cumplidos_provedore_crud_service.get(`/cambio_estado_cumplido/?query=Activo:true,CumplidoProveedorId.Id:${this.cumplidoProveedorId}&sortby=FechaCreacion&order=desc`).subscribe({
      next:(response)=>{
        if(!response.Success || response.Data.length==0){
          console.log(this.cambioEstadoCumplido)
        }
        this.cambioEstadoCumplido=response.Data[0]
        console.log(response)
      },
      error: err=>{
        console.log(err)
      },
    })
  }

  close(): void {
    this.dialogRef.close();
  }
}
