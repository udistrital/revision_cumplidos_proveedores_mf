import { Component, OnInit, ViewChild } from '@angular/core';
import { AletManagerService } from 'src/app/managers/alert-manager.service';
import { MatDialog } from '@angular/material/dialog';

import { Cumplido } from 'src/app/models/cumplido.model';
import { SoporteCumplido } from 'src/app/models/soporte_cumplido.model';
import { catchError, lastValueFrom, map, Observable, of } from 'rxjs';
import { CambioEstado } from 'src/app/models/cambio-estado.model';
import { SolicituDeFirma } from 'src/app/models/certificado-pago.model';
import { CumplidosProveedoresCrudService } from 'src/app/services/cumplidos_proveedores_crud.service';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.services';

import { CambioEstadoService } from 'src/app/services/cambio_estado_service';
import { ModalSoportesCumplidoComponent } from 'src/app/components/general-components/modal-soportes-cumplido/modal-soportes-cumplido.component';
import { Mode, RolUsuario, ModalSoportesCumplidoData } from 'src/app/models/modal-soporte-cumplido-data.model';
import { ModalVisualizarSoporteComponent } from 'src/app/components/general-components/modal-visualizar-soporte/modal-visualizar-soporte.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';



@Component({
  selector: 'app-tabla-aprobacion-ordenador-pago',
  templateUrl: './tabla-aprobacion-pago-ordenador.component.html',
  styleUrls: ['./tabla-aprobacion-pago-ordenador.component.css'],
})
export class TablaAprobacionPagoOrdenadorComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  solicitudes: Cumplido[] = [];
  soporte_cumplido: SoporteCumplido[] = [];
  documentoResponsable:string="";
  nombreResponsable:string="";
  data!:any;
  nombreOrdenador: string = "";
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
    this.obtenerInfoPersona();

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

    this.cumplidos_provedore_mid_service.get('/ordenador/solicitudes-pago/'+ this.documentoResponsable).subscribe(
      (response: any) => {

        Swal.close();
        if (response.Data != null && response.Data.length > 0) {
          this.solicitudes = response.Data;
          this.data = new MatTableDataSource<any>(this.solicitudes);
          this.data.paginator = this.paginator;
          this.data.sort = this.sort;
        } else {
          this.solicitudes = [];
          this.data = new MatTableDataSource<any>(this.solicitudes);
          this.data.paginator = this.paginator;
          this.data.sort = this.sort;
        }
      },
      (error) => {
        console.log("si entro");
        this.alertService.showCancelAlert("Error al consultar","Se produjo un error"+error);
        console.log('error', error);
        this.solicitudes = [];
        this.data = new MatTableDataSource<any>(this.solicitudes);
        this.data.paginator = this.paginator;
        this.data.sort = this.sort;
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
          this.dialog.open(ModalSoportesCumplidoComponent, {
            disableClose: true,
            maxHeight: '80vw',
            maxWidth: '100vw',
            height: '80vh',
            width: '80vw',
            data:{
              CumplidoProveedorId:idCumplido,
              Config:{
                mode:Mode.PRO,
                rolUsuario:RolUsuario.O
              }
            } as ModalSoportesCumplidoData
          });
        }
      },
      (error) => {
        this.alertService.showInfoAlert("Cumplido sin soportes","No se encontraron soportes para este cumplido proveedor")
      }
    );
  }

  async obtenerInfoPersona() {
    let info = this.userService.obtenerInformacionPersona().subscribe({
      next: (response) => {
        if (response != null) {
          this.nombreOrdenador =
            response[0].PrimerNombre +
            ' ' +
            response[0].SegundoNombre +
            ' ' +
            response[0].PrimerApellido +
            ' ' +
            response[0].SegundoApellido;
        }
      },
    });
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


      this.cambiarEstado(idCumplido,"RO");
      this.alertService.showSuccessAlert(
        'Rechazadado',
        '!Se han rechazado los soprtes!'
      );
      this.CargarTablaCumplidos();
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
      .get('/ordenador/autorizacion-giro/' + cumplidoId)
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
    this.dialog.open(ModalVisualizarSoporteComponent, {
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
          this.cambioEstadoService.cambiarEstado(id,esatadoCumplido),
      },
    });
  }


  cambiarEstado(idCumplido:any,estado:string){

    this.cambioEstadoService.cambiarEstado(idCumplido,estado);
      }

}