import { Component } from '@angular/core';
import { AletManagerService } from 'src/app/managers/alet-manager.service';

@Component({
  selector: 'app-modal-ver-soportes-contratacion',
  templateUrl: './modal-ver-soportes.component.html',
  styleUrls: ['./modal-ver-soportes.component.css']
})
export class ModalVerSoportesComponentContratacion {
  constructor(private alerts:AletManagerService){

  }

 documentos =[
  {
    name:"Informe de gestion"
  },  {
    name:"Cuenta de cobro"
  },
  {
    name:"Ceunta bancaria"
  },

 ]

  async enviarComnetario(){
    let enviarComnetario = await this.alerts.alertConfirm("¿Estas seguro de enviar las observaciones?");

    if(enviarComnetario.isConfirmed){
    this.alerts.showSuccessAlert("Comentario Guardado", "Se ha guardado el comentario en el documento")
    }else{
      this.alerts.showCancelAlert("Cancelado", "No se ha guardo ningun comentario");
    }
   }
}
