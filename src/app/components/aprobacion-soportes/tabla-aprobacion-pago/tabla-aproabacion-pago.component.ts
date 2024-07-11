import { Component } from '@angular/core';
import { AletManagerService } from 'src/app/managers/alet-manager.service';
import { ModalVerSoportesComponent } from '../modal-ver-soportes/modal-ver-soportes.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tabla-aproabacion-pago',
  templateUrl: './tabla-aproabacion-pago.component.html',
  styleUrls: ['./tabla-aproabacion-pago.component.css']
})
export class TablaAproabacionPagoComponent {

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
    this.dialog.open(ModalVerSoportesComponent,{
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
