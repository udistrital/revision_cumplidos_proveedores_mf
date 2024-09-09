import { Component } from '@angular/core';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { TranslateService } from '@ngx-translate/core';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { BodyCumplidoProveedor } from 'src/app/models/CargaSoportes/body_cumplido_proveedor.model';
import { CumplidosProveedoresCrudService } from 'src/app/services/cumplidos_proveedores_crud.service';
import { BodyCambioEstado } from 'src/app/models/CargaSoportes/body_cambio_estado.model';
import { UserService } from 'src/app/services/user.services';
import { CargarModalComponent } from '../../subir_soporte/cargar-modal/cargar-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { CambioEstadoService } from 'src/app/services/cambio_estado_service';
import { AletManagerService } from 'src/app/managers/alert-manager.service';


@Component({
  selector: 'app-modal-carga-soprotes',
  templateUrl: './modal-carga-soprotes.component.html',
  styleUrls: ['./modal-carga-soprotes.component.css']
})
export class ModalCargaSoprotesComponent {

  documento_supervisor!: string
  numeroContrato!: string;
  vigencia!: string;
  solicitudes_contrato!: any;
  dataSource: any[] = [];
  newCumplidoProveedor!: BodyCumplidoProveedor
  newCambioEstado!: BodyCambioEstado




  constructor(
    private cumplidosMidServices: CumplidosProveedoresMidService,
    private popUpManager: PopUpManager,
    private translate: TranslateService,
    private cumplidosCrudService:CumplidosProveedoresCrudService,
    private user: UserService,
    public dialog: MatDialog,
    private cambioEstadoService:CambioEstadoService,
    private alertService:AletManagerService
  ){
    this.documento_supervisor = user.getPayload().documento;
  }

  ngOnInit() {
    this.cumplidosMidServices.contrato$.subscribe(contrato => {
      if (contrato) {
        this.numeroContrato = contrato.numeroContrato;
        this.vigencia = contrato.vigencia;
     
        this.getSolicitudesContrato(this.numeroContrato, this.vigencia);

        this.newCumplidoProveedor = {
          NumeroContrato: this.numeroContrato,
          VigenciaContrato: Number(this.vigencia),

        }



      }
    })
  }



  getSolicitudesContrato(numero_contrato: string, vigencia_contrato: string){
    console.log(numero_contrato)
    console.log(vigencia_contrato)
    this.cumplidosMidServices.contrato$.subscribe(contrato  => {
      if (contrato) {
        this.cumplidosMidServices.get('/supervisor/solicitudes-contrato/' + numero_contrato + '/' + vigencia_contrato)
          .subscribe({
            next: (res: any) => {
              var count = 1
              this.solicitudes_contrato = res.Data;
              this.dataSource = this.solicitudes_contrato.map((solicitud: any) => {
                console.log(res.Data,"..Dataparalafecha")
                return {
                  noSolicitud: count++,
                  numeroContrato: solicitud.CumplidoProveedorId.NumeroContrato,
                  fechaCreacion: new Date(solicitud.FechaCreacion),
                  periodo: "11/04/2024 - 11/05/2024",
                  estadoSoliciatud: solicitud.EstadoCumplido,
                  acciones: 'Editar, Eliminar',
                  cumplidoProveedor: solicitud.CumplidoProveedorId
                };
              })
            },
            error: (error: any) => {
              this.popUpManager.showErrorAlert('El Proveedor no tiene ninguna solicitud reciente');
            }
          });
      }
    })
  }

  displayedColumns: string[] = ['noSolicitud', 'numeroContrato', 'fechaCreacion', 'periodo', 'estadoSoliciatud', 'acciones'];


  crearCumplidoProveedor(){
    this.cumplidosCrudService.post('/cumplido_proveedor', this.newCumplidoProveedor)
      .subscribe({
        next: (res: any) => {
          console.log(res)
          this.newCambioEstado = {
            CodigoAbreviacionEstadoCumplido:"CD",
            CumplidoProveedorId: res.Data.Id,


          }
          this.cumplidosMidServices.post('/solicitud-pago/cambio-estado', this.newCambioEstado)
            .subscribe({
              next: (res: any) => {
                this.popUpManager.showSuccessAlert("Se ha creado el cumplido correctamente");
                setTimeout(() => {
                  this.getSolicitudesContrato(this.numeroContrato, this.vigencia)
                }, 1);
              },
              error: (error: any) => {
                this.popUpManager.showErrorAlert('Error al cambiar el estado de la solicitud');
              }
            });
        },
        error: (error: any) => {
          this.popUpManager.showErrorAlert('No fue Posible crear la solicitud de pago')
        }
      });
  }

  openDialog(cumplido: any) {
    console.log("cumplido"+cumplido);
    this.cumplidosMidServices.getCumplidoProveedor(cumplido);
    const dialogRef = this.dialog.open(CargarModalComponent, {
      width: '53%',
      height: '70%',
      panelClass: 'custom-dialog-container',
      data:{
        cumplido:cumplido
      }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }


  async cambiarEstado(idCumplido:any){

    let confirm = await this.alertService.alertConfirm(
      '¿Esta seguro de aprobar los soportes?'
    );
    console.log(idCumplido);
    if (confirm.isConfirmed) {
      this.cambioEstadoService.cambiarEstado(idCumplido.cumplidoProveedor.Id,"PRC");
    }else{
      this.alertService.showCancelAlert("Cancelado","No se ha relizado ninguna accion");
    }
     
    this.getSolicitudesContrato(idCumplido.cumplidoProveedor.NumeroContrato,idCumplido.cumplidoProveedor.VigenciaContrato)
  }
  

}
