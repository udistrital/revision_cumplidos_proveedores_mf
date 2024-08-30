import { Component, OnInit, ViewChild } from '@angular/core';
import { AletManagerService } from 'src/app/managers/alert-manager.service';
import { MatDialog } from '@angular/material/dialog';

import { Cumplido } from 'src/app/models/cumplido.model';
import { SoporteCumplido } from 'src/app/models/soporte_cumplido.model';
import { catchError, lastValueFrom, map, Observable, of } from 'rxjs';
import { CambioEstado } from 'src/app/models/cambio-estado.model';
import { SolicituDeFirma } from 'src/app/models/certificado-pago.model';
import { ModalListarSoportes } from 'src/app/components/modal-listar-soportes/modal-listar-soportes.component';
import { ModalVerSoporteComponent } from 'src/app/components/modal-ver-soporte/modal-ver-soporte.component';
import { CumplidosProveedoresCrudService } from 'src/app/services/cumplidos_proveedores_crud.service';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.services';

import { CambioEstadoService } from 'src/app/services/cambio_estado_service';
@Component({
  selector: 'app-tabla-aprobacion-ordenador-pago',
  templateUrl: './tabla-aprobacion-pago-ordenador.component.html',
  styleUrls: ['./tabla-aprobacion-pago-ordenador.component.css'],
})
export class TablaAprobacionPagoOrdenadorComponent implements OnInit {
  solicitudes: Cumplido[] = [];
  soporte_cumplido: SoporteCumplido[] = [];
  documentoResponsable:string="";
  nombreResponsable:string="";
  constructor(
    private alertService: AletManagerService,
    public dialog: MatDialog,
    private cumplidos_provedore_crud_service:CumplidosProveedoresCrudService,
    private cumplidos_provedore_mid_service:CumplidosProveedoresMidService,
    private cambioEstadoService:CambioEstadoService,
    private userService:UserService,
    
     
  ) {}
  ngOnInit(): void {
   this.documentoResponsable= this.userService.getPayload().documento 
    this.CargarTablaCumplidos();
    this.nombreResponsable=this.userService.getPayload().sub

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
    console.log("entro")
    this.solicitudes = [];
    this.alertService.showLoadingAlert("Cargando", "Espera mientras se cargan las solicitudes pendientes")
   
    this.cumplidos_provedore_mid_service.get('/ordenador/solicitudes-pago/'+ this.documentoResponsable).subscribe(
      (response: any) => {
        Swal.close();
        if (response.Data != null && response.Data.length > 0) {
          this.solicitudes = response.Data;
        } else {
          this.solicitudes = [];
        }
      },
      (error) => {
        this.alertService.showCancelAlert("Error al consultar","Se produjo un error"+error);
        console.log('error', error);
        this.solicitudes = [];
      }
    );
  }

  ListarSoportes(idCumplido: number) {
    this.alertService.showLoadingAlert("Cargando", "Espera mientras se listan los documentos")
    this.cumplidos_provedore_mid_service.get('/solicitud-pago/soportes/' + idCumplido).subscribe(
      (response: any) => {
        Swal.close()
        if (response.Data.length > 0) {
          this.soporte_cumplido = response.Data;
          this.dialog.open(ModalListarSoportes, {
            disableClose: true,
            maxHeight: '80vw',
            maxWidth: '100vw',
            height: '80vh',
            width: '50%',
            data: { soporteCumplido: this.soporte_cumplido,
              idCumplido: idCumplido
             },
          });
        }
      },
      (error) => {
        this.alertService.showCancelAlert("Error alcargar documentos","Se peodujo"+ error)
      }
    );
  }

  async verAutorizacionDePago(idCumplido: number) {

    const autorizacionPago = await this.GenerarAutotizacionDePago(
      idCumplido
    ).toPromise()
    if (autorizacionPago != null) {
      this.modalVerSoporte(autorizacionPago, idCumplido);
    }
  
  }

  async rechazarCumplido(idCumplido: any) {
    
    let x = await this.alertService.alertConfirm(
      '¿Esta seguro de Rechazar los soportes?'
    );
    if (x.isConfirmed) {
     

      this.cambiarEstado(idCumplido.Id,"RO", "0","Contratacion");
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

  CambiarEstado(cambioEstado: CambioEstado) {
    this.cumplidos_provedore_mid_service
      .post('/solicitud-pago/cambio-estado', cambioEstado)
      .subscribe(
        (response) => {
          console.log(cambioEstado)
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  ObtenerEstadoId(codigoAbreviacion: string): Observable<number | null> {
    return this.cumplidos_provedore_crud_service
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

  GenerarAutotizacionDePago(cumplidoId: number): Observable<SolicituDeFirma | null> {
  
    return this.cumplidos_provedore_mid_service
      .get('/ordenador/certificado-aprobacion-pago/' + cumplidoId)
      .pipe(
        map((response: any) => {
          if (response.Data != null) {
              console.log(response)
            return new SolicituDeFirma(
      
              response.Data.NombreArchivo,
              response.Data.NombreResponsable ,
               response.Data.CargoResponsable, 
               response.Data.DescripcionDocumento, 
               response.Data.Archivo);
          }
          console.log()
          return null;
        }),
        catchError((error) => {
          console.error('Error', error);
          return of(null);
        })
      );
  }

  cargarAutotizacionDePago(autorizacionPago: SolicituDeFirma) {
    this.cumplidos_provedore_mid_service
      .post(`solicitud-pago/soportes`, autorizacionPago)
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  modalVerSoporte(autorizacionPago: SolicituDeFirma, idCumplido: number) {
    console.log("---")
    console.log(autorizacionPago)
    console.log("----")
    this.dialog.open(ModalVerSoporteComponent, {
      disableClose: true,
      height: '70vh',
      width: '40vw',
      maxWidth: '60vw',
      maxHeight: '80vh',
      panelClass: 'custom-dialog-container',
      data: {
        documentoAFirmar: autorizacionPago,
        aprobarSoportes: true,
        idCumplido: idCumplido,
        tipoDocumento:168,
        base64:autorizacionPago.Archivo,
        cargoResponsable:"Ordenador",
        documentoResponsable:this.documentoResponsable,
        estadoCumplido:"AO",
        funcionAprobar: (id: number,esatadoCumplido:string, documentoResponsable:string, cargoResponsable:string) =>
          this.cambioEstadoService.cambiarEstado(id,esatadoCumplido,documentoResponsable,cargoResponsable),
      },
    });
  }

  
  cambiarEstado(idCumplido:any,estado:string, documentoResponsable:string, cargoResponable:string){
 
    this.cambioEstadoService.cambiarEstado(idCumplido,estado,documentoResponsable,cargoResponable);
      }

}
