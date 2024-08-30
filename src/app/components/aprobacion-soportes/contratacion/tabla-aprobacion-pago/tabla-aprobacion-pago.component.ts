import { Component } from '@angular/core';
import { AletManagerService } from 'src/app/managers/alert-manager.service';
import { MatDialog } from '@angular/material/dialog';
import { Cumplido } from 'src/app/models/cumplido.model';
import { catchError, map, Observable, of } from 'rxjs';
import { CambioEstado } from 'src/app/models/cambio-estado.model';
import { ModalListarSoportes } from 'src/app/components/modal-listar-soportes/modal-listar-soportes.component';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { CumplidosProveedoresCrudService } from 'src/app/services/cumplidos_proveedores_crud.service';
import Swal from 'sweetalert2';
import { SoporteCumplido } from 'src/app/models/soporte_cumplido.model';
import { CambioEstadoService } from 'src/app/services/cambio_estado_service';
import { UserService } from 'src/app/services/user.services';
@Component({
  selector: 'app-tabla-aprobacion-pago-contratacion',
  templateUrl: './tabla-aprobacion-pago.component.html',
  styleUrls: ['./tabla-aprobacion-pago.component.css'],
})
export class TablaAprobacionPagoComponent {
  solicitudes: Cumplido[] = [];
  soporte_cumplido: SoporteCumplido[] = [];
  documentoResponsable:string=""

  constructor(
    private alertService: AletManagerService,
    public dialog: MatDialog,
    private cumplidos_provedore_crud_service:CumplidosProveedoresCrudService,
    private cumplidos_provedore_mid_service:CumplidosProveedoresMidService,
    private cambioEstadoService:CambioEstadoService,
    private userService:UserService
  ) {
   
    this.CargarTablaCumplidos();
  }

  displayedColumns = [
    'numeroContrato',
    'vigencia',
    'rp',
    'vigenciaRp',
    'fechaCreacion',
    'nombreProveedor',
    'dependencia',
    'acciones',
  ];

  CargarTablaCumplidos() {
    this.solicitudes = [];
    this.alertService.showLoadingAlert("Cargando", "Espera mientras se cargan las solicitudes pendientes")
    this.cumplidos_provedore_mid_service.get('/contratacion/solicitudes-pago/').subscribe(
      (response: any) => {
        Swal.close();
        if (response.Data != null && response.Data.length > 0) {
          this.solicitudes = response.Data;
        } else {
          this.solicitudes = [];
        }
      },
      (error) => {
        this.alertService.showCancelAlert("Error Al consultar", "Se produjo " + error +" al consultar")
        this.solicitudes = [];
      }
    );
  }

  ListarSoportes(idCumplido: number) {
    this.alertService.showLoadingAlert("Cargando", "Espera mientras se listan los documentos")
    this.cumplidos_provedore_mid_service.get('/solicitud-pago/soportes/' + idCumplido).subscribe(
      (response: any) => {
        if (response.Data.length > 0) {
          Swal.close()
          this.soporte_cumplido = response.Data;
          this.dialog.open(ModalListarSoportes, {
            disableClose: true,
            height: '70vh',
            width: '40vw',
            maxWidth: '60vw',
            maxHeight: '80vh',
            panelClass: 'custom-dialog-container',
            data: { soporteCumplido: this.soporte_cumplido,idCumplido: idCumplido },
          });
        }
      },
      (error) => {
        console.log('error', error);
      }
    );
  }

  async aprobarSoportes(cumplido: any) {



    console.log(cumplido)
    let confirm = await this.alertService.alertConfirm(
      '¿Esta seguro de aprobar los soportes?'
    );
    console.log(cumplido);
    if (confirm.isConfirmed) {
      try{

        this.cambiarEstado(cumplido.Id,"PRO", "265313","Ordenador");
        this.alertService.showSuccessAlert(
          'Rehzadado',
          '!Se han rechazado los soprtes!'
        );

      this.alertService.showSuccessAlert('Aprobado', '!se Aprobo con exito!');
      }catch(error){
        this.alertService.showCancelAlert(
          'Cancelado',
          'No se pudo relizar la accion'+error
        );
      }
    } else {
      this.alertService.showCancelAlert(
        'Cancelado',
        'No se pudo relizar la accion'
      );
    }
  }

  async rechazarSoportes(cumplido: any) {

  this.obtenerResponsable("/informacion_supervisor_contrato/"+cumplido.NumeroContrato+"/"+cumplido.VigenciaContrato)
    let x = await this.alertService.alertConfirm(
      '¿Esta seguro de Rechazar los soportes?'
    );
    if (x.isConfirmed) {
     

      this.cambiarEstado(cumplido.Id,"RC", "0","Contratacion");
      this.alertService.showSuccessAlert(
        'Rehzadado',
        '!Se han rechazado los soprtes!'
      );
    } else {
      this.alertService.showCancelAlert(
        'Cancelado',
        'No se han rechazado los sooprtes'
      );
    }
  }



  ObtenerEstadoId(codigoAbreviacion: string): Observable<number | null> {
    return this.cumplidos_provedore_mid_service
      .get(
        `/estado_cumplido?query=CodigoAbreviación:${codigoAbreviacion}`
      )
      .pipe(
        map((response: any) => {
          if (response.Data != null && response.Data.length > 0) {
            return response.Data[0].Id;
          }
          return null;
        }),
        catchError((error) => {
          console.error('Error', error);
          return of(null);
        })
      );
  }

  ObternerIdTipoDocumento(codigoAbreviacion: string) {
    return this.cumplidos_provedore_crud_service
      .get(
        `tipo_documento/?query=DominioTipoDocumento.CodigoAbreviacion:CUMP_PROV,CodigoAbreviacion:${codigoAbreviacion}`
      )
      .pipe(
        map((response: any) => {
          if (response.Data != null && response.Data.length > 0) {
            console.log(response);
          }
          return null;
        }),
        catchError((error) => {
          console.error('Error', error);
          return of(null);
        })
      );
  }


  private async obtenerResponsable(endPoint:string){
    
    this.documentoResponsable = await this.userService.obtenerResponsable(endPoint);
   }
 
 

  cambiarEstado(idCumplido:any,estado:string, documentoResponsable:string, cargoResponable:string){
 
    this.cambioEstadoService.cambiarEstado(idCumplido,estado,documentoResponsable,cargoResponable);
      }


}
