import { Component, Input, OnInit } from '@angular/core';
import { AletManagerService } from 'src/app/managers/alert-manager.service';
import { Dependencia } from 'src/app/models/CargaSoportes/contratos_supervisor.model';
import { Month } from 'src/app/models/month.model';
import Swal from 'sweetalert2';

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

  constructor(private alertService:AletManagerService){}

  ngOnInit(): void {
  }


  async consultar(){

   let comfirm = await this.alertService.alertConfirm("¿Estas seguro?","Se va a relizar la busqueda , pude tomar unos momentos")

   if(comfirm.isConfirmed){
      this.alertService.showLoadingAlert("Espera","La busqueda se esta relalizado")

      setTimeout(()=>{
        Swal.close()
      },1000);

   }else{
    this.alertService.showCancelAlert("Cancelado", "No se realizo ninguna accion")
   }
  }
  

}
