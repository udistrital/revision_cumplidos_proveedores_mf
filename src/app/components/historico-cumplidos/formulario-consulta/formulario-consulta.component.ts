import { Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Month } from 'src/app/models/month.model';
import { PopUpManager } from 'src/app/managers/popUpManager';

@Component({
  selector: 'app-formulario-consulta',
  templateUrl: './formulario-consulta.component.html',
  styleUrls: ['./formulario-consulta.component.css']
})
export class FormularioConsultaComponent  implements OnInit {

  @Input() anios:number[]=[];
  @Input() meses:Month[]=[];
  @Input() dependencias:any[]=[]
  @Input() estados:any[]=[]
  title:string="CONSULTA CUMPLIDOS APROBADOS"

  constructor(private popUpManager:PopUpManager){}

  ngOnInit(): void {
  }


  async consultar(){

   let comfirm = await this.popUpManager.showConfirmAlert("¿Estas seguro?","Se va a relizar la busqueda , pude tomar unos momentos")

   if(comfirm.isConfirmed){
      this.popUpManager.showLoadingAlert("Espera","La busqueda se esta relalizado")

      setTimeout(()=>{
        Swal.close()
      },1000);

   }else{
    this.popUpManager.showErrorAlert("No se realizo ninguna accion")
   }
  }
  

}
