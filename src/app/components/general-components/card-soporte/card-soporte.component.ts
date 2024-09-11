import { Component, EventEmitter, Input, numberAttribute, Output } from '@angular/core';
import { Soporte } from 'src/app/models/soporte.model';
import { MatDialog } from '@angular/material/dialog';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { AletManagerService } from 'src/app/managers/alert-manager.service';
import { ComentarioSoporte } from 'src/app/models/basics/comentario-soporte.model';
import { CumplidosProveedoresCrudService } from 'src/app/services/cumplidos_proveedores_crud.service';
import { ModalVisualizarSoporteComponent } from '../modal-visualizar-soporte/modal-visualizar-soporte.component';
import { CambioEstadoCumplido } from 'src/app/models/basics/cambio-estado-cumplio.model';
import { ConfigSoportes, Mode,RolUsuario } from 'src/app/models/modal-soporte-cumplido-data.model';
import { SoporteCumplido } from 'src/app/models/soporte_cumplido.model';



@Component({
  selector: 'app-card-soporte',
  templateUrl: './card-soporte.component.html',
  styleUrls: ['./card-soporte.component.css']
})
export class CardSoporteComponent {

  @Input({required:true}) soporte!:SoporteCumplido
  @Input({required:true}) config!:ConfigSoportes
  @Input({required:true}) cambioEstadoCumplido!:CambioEstadoCumplido
  @Output() recargarSoportes = new EventEmitter<any>();
  mode=Mode
  rolUsuario=RolUsuario

  constructor(
    public dialog: MatDialog,
    private popUpManager: PopUpManager,
    private cumplidosMidServices: CumplidosProveedoresMidService,
    private aletManagerService:AletManagerService,
    private cumplidos_provedore_crud_service:CumplidosProveedoresCrudService,
  ){

  }

  ngOnInit() {
    console.log("cambio estado id",this.cambioEstadoCumplido)
  }

  openVerSoporte() {
    this.dialog.open(ModalVisualizarSoporteComponent, {
      disableClose: true,
      height: '70vh',
      width: '50vw',
      maxWidth: '60vw',
      maxHeight: '80vh',
      panelClass: 'custom-dialog-container',
      data: { url: this.soporte.Archivo.File }
    });
  }

  async eliminarSoporte(){
 
       const confirm = await this.aletManagerService.alertConfirm("¿Deseas Eliminar el soporte?");
       if(confirm.isConfirmed){
        
        console.log(this.soporte)
        try{
          this.cumplidosMidServices.delete(`/solicitud-pago/soportes`, this.soporte.Documento)
        .subscribe({
          next: (res: any) => {
            this.recargarSoportes.emit(res)
            this.popUpManager.showSuccessAlert('Soporte eliminado correctamente');
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

  async enviarComentario(){

    let enviarComnetario = await this.aletManagerService.alertConfirm("¿Estas seguro de enviar las observaciones?").then(()=>{
      try{
        const  comentario:ComentarioSoporte= <ComentarioSoporte>{
          SoporteCumplidoId: {
            Id:this.soporte.SoporteCumplidoId
          },
          CambioEstadoCumplidoId:{
            Id:this.cambioEstadoCumplido.Id
          },
          Comentario:""
        }
        this.cumplidos_provedore_crud_service.post("/comentario_soporte",comentario).subscribe((response)=>{
          this.aletManagerService.showSuccessAlert("Comentario Guardado", "Se ha guardado el comentario en el documento")
        });
      }catch(error){
        this.aletManagerService.showCancelAlert("Cancelado", "No se ha guardo ningun comentario"+error);
      }
    }).catch(()=>{
      this.aletManagerService.showCancelAlert("Cancelado", "No se ha guardo ningun comentario");
    });
   }
}
