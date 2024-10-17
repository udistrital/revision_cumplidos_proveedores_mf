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
import { CumplidosProveedoresCrudService } from 'src/app/services/cumplidos_proveedores_crud.service';
import { Button } from 'src/app/models/button.model';
import { CambioEstadoCumplido } from 'src/app/models/revision_cumplidos_proveedores_crud/cambio-estado-cumplio.model';
import { ConfigSoportes, ModalComentariosSoporteData, Mode,RolUsuario } from 'src/app/models/modal-soporte-cumplido-data.model';
import { InformacionSoporteCumplido } from 'src/app/models/revision_cumplidos_proveedores_mid/informacion_soporte_cumplido.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComentariosSoporteComponent } from '../modal-comentarios-soporte/modal-comentarios-soporte.component';
import { ModalVisualizarSoporteComponent } from '../modal-visualizar-soporte/modal-visualizar-soporte.component';


@Component({
  selector: 'app-card-soporte',
  templateUrl: './card-soporte.component.html',
  styleUrls: ['./card-soporte.component.scss'],
})
export class CardSoporteComponent {

  @Input({required:true}) soporte!:InformacionSoporteCumplido
  @Input({required:true}) config!:ConfigSoportes
  @Input({required:true}) cumplidoProveedorId!: number
  @Input() buttons!: Button[];
  @Output() recargarSoportes = new EventEmitter<any>();
  comentarioForm: FormGroup;
  mode=Mode
  rolUsuario=RolUsuario

  constructor(
    public dialog: MatDialog,
    private popUpManager: PopUpManager,
    private cumplidos_provedore_crud_service:CumplidosProveedoresCrudService,
    private fb: FormBuilder
  ){
    this.comentarioForm = this.fb.group({
      comentario: ['', [Validators.minLength(10), Validators.pattern(/^(?!\s)[\s\S]*\S+$/)]],
    });

  }

  ngOnInit() {

  }

  async eliminarSoporte(soporteId: number){

    const confirm = await this.popUpManager.showConfirmAlert(
      "¿Deseas eliminar el soporte?"
    );
       if(confirm.isConfirmed){

        //console.log(this.soporte)
        try{
          this.cumplidos_provedore_crud_service.delete(`/soporte_cumplido`, soporteId)
        .subscribe({
          next: (res: any) => {
            //console.log("Buttons:", this.buttons)
            this.recargarSoportes.emit(res)
            this.popUpManager.showSuccessAlert(
              'El soporte se ha eliminado correctamente.'
            );
          },
          error: (error: any) => {
            this.popUpManager.showErrorAlert(
              'No fue posible eliminar el soporte.'
            );
          }
        });
        }catch(error){
          this.popUpManager.showErrorAlert(
            "Error al intentar eliminar el soporte."
          );
        }

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

   openDialog(soporte_id: number, tipo_soporte: string, cumplido_proveedor_id: number) {
    //console.log("Soportes: ", this.soporte)
    this.dialog.open(ModalComentariosSoporteComponent, {
      disableClose: true,
      maxHeight: '80vh',
      maxWidth: '60vw',
      minHeight: '30vh',
      minWidth: '30vw',
      height: 'auto',
      width: 'auto',
      data:{
        SoporteId: soporte_id,
        CumplidoProveedorId: cumplido_proveedor_id,
        TipoSoporte: tipo_soporte,
        Config:{
          mode:this.config.mode,
          rolUsuario: this.config.rolUsuario
        }
      } as ModalComentariosSoporteData
    });
    }

    visualizarSoporte(soporte: any){
      this.dialog.open(ModalVisualizarSoporteComponent, {
        disableClose: true,
        height: 'auto',
        width: 'auto',
        maxWidth: '60vw',
        maxHeight: '80vh',
        panelClass: 'custom-dialog-container',
        data: {
          url: soporte.Archivo.File,
        },
      });
    }

    evaluarCondicional(button: any): boolean{
      if (button.Text == 'Comentarios'){
        return !(this.config.mode == this.mode.CD && this.config.rolUsuario == this.rolUsuario.S);
      } else if (button.Text == 'Eliminar'){
        return ((this.config.mode == this.mode.CD || this.config.mode == this.mode.RC || this.config.mode == this.mode.RO) && this.config.rolUsuario == this.rolUsuario.S);
      } else {
        return true;
      }
    }

    handleActionClick(button: any, soporte: any, cumplido_proveedor_id: number){
      if (button.Text == 'Comentarios'){
        this.openDialog(soporte.SoporteCumplidoId, soporte.TipoSoporte, cumplido_proveedor_id);
      } else if (button.Text == 'Eliminar'){
        this.eliminarSoporte(soporte.SoporteCumplidoId);
      } else {
        this.visualizarSoporte(soporte);
      }
    }
}
