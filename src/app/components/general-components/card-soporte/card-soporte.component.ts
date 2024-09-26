import {
  Component,
  EventEmitter,
  Input,
  numberAttribute,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { AletManagerService } from 'src/app/managers/alert-manager.service';
import { CumplidosProveedoresCrudService } from 'src/app/services/cumplidos_proveedores_crud.service';
import { Button } from 'src/app/models/button.model';
import { CambioEstadoCumplido } from 'src/app/models/revision_cumplidos_proveedores_crud/cambio-estado-cumplio.model';
import { ConfigSoportes, ModalComentariosSoporteData, Mode,RolUsuario } from 'src/app/models/modal-soporte-cumplido-data.model';
import { InformacionSoporteCumplido } from 'src/app/models/revision_cumplidos_proveedores_mid/informacion_soporte_cumplido.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComentariosSoporteComponent } from '../modal-comentarios-soporte/modal-comentarios-soporte.component';


@Component({
  selector: 'app-card-soporte',
  templateUrl: './card-soporte.component.html',
  styleUrls: ['./card-soporte.component.scss'],
})
export class CardSoporteComponent {

  @Input({required:true}) soporte!:InformacionSoporteCumplido
  @Input({required:true}) config!:ConfigSoportes
  @Input({required:true}) cambioEstadoCumplido!:CambioEstadoCumplido
  @Input() buttons!: Button[];
  @Output() recargarSoportes = new EventEmitter<any>();
  comentarioForm: FormGroup;
  mode=Mode
  rolUsuario=RolUsuario

  constructor(
    public dialog: MatDialog,
    private popUpManager: PopUpManager,
    private cumplidosMidServices: CumplidosProveedoresMidService,
    private aletManagerService:AletManagerService,
    private cumplidos_provedore_crud_service:CumplidosProveedoresCrudService,
    private fb: FormBuilder
  ){
    this.comentarioForm = this.fb.group({
      comentario: ['', [Validators.minLength(10), Validators.pattern(/^(?!\s)[\s\S]*\S+$/)]],
    });
  }

  ngOnInit() {

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

  // async enviarComentario() {
  //   await this.aletManagerService
  //     .alertConfirm('¿Estas seguro de enviar las observaciones?')
  //     .then((confirmed: any) => {
  //       console.log(confirmed);
  //     if(confirmed.isConfirmed){
  //       console.log("Comentario",this.comentarioForm.value.comentario)
  //       try{
  //         const  comentario:ComentarioSoporte= <ComentarioSoporte>{
  //           SoporteCumplidoId: {
  //             Id:this.soporte.SoporteCumplidoId
  //           },
  //           CambioEstadoCumplidoId:{
  //             Id:this.cambioEstadoCumplido.Id
  //           },
  //           Comentario:this.comentarioForm.value.comentario
  //         }
  //       } catch (error) {
  //         this.aletManagerService.showCancelAlert("")
  //       }
  //     }
  //   }).catch(()=>{
  //     this.aletManagerService.showCancelAlert("Cancelado", "No se ha guardo ningun comentario");
  //   });
  //  }

   openDialog(soporte_id: number, cambio_estado_cumplido_id: number, tipo_soporte: string) {
    this.dialog.open(ModalComentariosSoporteComponent, {
      disableClose: true,
      maxHeight: '80vw',
      maxWidth: '60vw',
      height: 'auto',
      width: 'auto',
      data:{
        SoporteId: soporte_id,
        CambioEstadoCumplidoId: cambio_estado_cumplido_id,
        TipoSoporte: tipo_soporte,
        Config:{
          mode:this.config.mode,
          rolUsuario: this.config.rolUsuario
        }
      } as ModalComentariosSoporteData
    });
    }
}
