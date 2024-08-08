import { Component } from '@angular/core';
import { AletManagerService } from 'src/app/managers/alet-manager.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalVerSoportesComponentContratacion } from './../modal-ver-soportes/modal-ver-soportes.component';


@Component({
  selector: 'app-tabla-aprobacion-pago',
  templateUrl: './tabla-aprobacion-pago.component.html',
  styleUrls: ['./tabla-aprobacion-pago.component.css']
})
export class TablaAprobacionPagoComponent {


  constructor(private alertService: AletManagerService,public dialog:MatDialog){
    
  }
  displayedColumns=["numeroContrato","vigencia","rp","vigenciaRp","fechaCreacion","nombreProveedor","dependencia", "acciones"]
  data=[
    {numeroContrato:"1234",
      vigencia: "2220",
      rp: "233423",
      vigenciaRp:"2020-1-12",
      fechaCreacion:"2020-1-2",
      nombreProveedor: "Clinica x",
      dependencia:"Ofiicina assesora de sistenas"
    }
  ]


  openVerSoportes() {
    this.dialog.open(ModalVerSoportesComponentContratacion,{
      disableClose: true,
      maxHeight:"80vw",
      maxWidth:"100vw",
      height: "80vh",
      width:"50%"
    });
  }


async  alertaAprobarSoporte(){
 let x= await this.alertService.alertConfirm("¿Esta seguro de aprobar los soportes?");

 if(x.isConfirmed){
 
  this.alertService.showSuccessAlert("Aprobado","!se Aprobo con exito!");
 }else{
  this.alertService.showCancelAlert("Cancelado","No se pudo relizar la accion");
 }

 
}
}
