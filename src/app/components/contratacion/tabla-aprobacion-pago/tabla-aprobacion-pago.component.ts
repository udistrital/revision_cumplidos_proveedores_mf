import { Component, ViewChild } from '@angular/core';
import { AletManagerService } from 'src/app/managers/alert-manager.service';
import { MatDialog } from '@angular/material/dialog';
import { Cumplido } from 'src/app/models/cumplido.model';
import { catchError, map, Observable, of } from 'rxjs';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { CumplidosProveedoresCrudService } from 'src/app/services/cumplidos_proveedores_crud.service';
import Swal from 'sweetalert2';
import { SoporteCumplido } from 'src/app/models/soporte_cumplido.model';
import { CambioEstadoService } from 'src/app/services/cambio_estado_service';
import { UserService } from 'src/app/services/user.services';
import { ModalSoportesCumplidoComponent } from 'src/app/components/general-components/modal-soportes-cumplido/modal-soportes-cumplido.component';
import { Mode, RolUsuario, ModalSoportesCumplidoData } from 'src/app/models/modal-soporte-cumplido-data.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';



@Component({
  selector: 'app-tabla-aprobacion-pago-contratacion',
  templateUrl: './tabla-aprobacion-pago.component.html',
  styleUrls: ['./tabla-aprobacion-pago.component.css'],
})
export class TablaAprobacionPagoComponent {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  solicitudes: Cumplido[] = [];
  soporte_cumplido: SoporteCumplido[] = [];
  documentoResponsable: string = '';
  nombreContratacion!: string;
  data!: any;

  constructor(
    private alertService: AletManagerService,
    public dialog: MatDialog,
    private cumplidos_provedore_crud_service: CumplidosProveedoresCrudService,
    private cumplidos_provedore_mid_service: CumplidosProveedoresMidService,
    private cambioEstadoService: CambioEstadoService,
    private userService: UserService,

  ) {
    this.obtenerInfoPersona();
    this.cargarTablaCumplidos();
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

  cargarTablaCumplidos() {
    this.solicitudes = [];
    this.alertService.showLoadingAlert(
      'Cargando',
      'Espera mientras se cargan las solicitudes pendientes'
    );
    this.cumplidos_provedore_mid_service
      .get('/contratacion/solicitudes-pago/')
      .subscribe(
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
          this.alertService.showInfoAlert(
            'Sin cumplidos pendientes',
            'No hay cumplidos pendientes para revision por parte de contratación'
          );
          this.solicitudes = [];
          this.data = new MatTableDataSource<any>(this.solicitudes);
          this.data.paginator = this.paginator;
          this.data.sort = this.sort;
        }
      );
  }

  async obtenerInfoPersona() {
    let info = this.userService.obtenerInformacionPersona().subscribe({
      next: (response) => {
        if (response != null) {
          this.nombreContratacion =
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

  obtenerSoprtes(idCumplido: number) {
    console.log(idCumplido);
    this.alertService.showLoadingAlert(
      'Cargando',
      'Espera mientras se listan los documentos'
    );
    this.cumplidos_provedore_mid_service
      .get('/solicitud-pago/soportes/' + idCumplido)
      .subscribe(
        (response: any) => {
          if (response.Data.length > 0) {
            Swal.close();
            this.soporte_cumplido = response.Data;
            console.log(response.Data);
            this.dialog.open(ModalSoportesCumplidoComponent, {
              disableClose: true,
              maxHeight: '80vw',
              maxWidth: '100vw',
              height: '80vh',
              width: '80vw',
              data:{
                CumplidoProveedorId:idCumplido,
                Config:{
                  mode:Mode.PRC,
                  rolUsuario:RolUsuario.C
                }
              } as ModalSoportesCumplidoData
            });
          }
        },
        (error) => {
          Swal.close();
          this.alertService.showInfoAlert(
            'Cumplido sin soportes',
            'No se encontraron soportes para este cumplido'
          );
          console.log('error', error);
        }
      );
  }

  async aprobarSoportes(cumplido: any) {
    console.log(cumplido);
    let confirm = await this.alertService.alertConfirm(
      '¿Esta seguro de aprobar los soportes?'
    );
    console.log(cumplido);
    if (confirm.isConfirmed) {
      this.cambioEstadoService
        .cambiarEstado(cumplido.CumplidoId, 'AC')
        .then((response) => {
          this.alertService.showSuccessAlert(
            'Aprobado',
            '!Se ha Aprobado el  soprte!'
          );
          this.cargarTablaCumplidos()
        })
        .catch((error) => {
          this.alertService.showErrorAlert('Error al aprobar soporte');
        });
    }
  }

  async rechazarSoportes(cumplido: any) {
    console.log('Objecto', cumplido);
    let x = await this.alertService.alertConfirm(
      '¿Esta seguro de Rechazar los soportes?'
    );
    if (x.isConfirmed) {
      this.cambioEstadoService
        .cambiarEstado(cumplido.CumplidoId, 'RC')
        .then((response) => {
          this.alertService.showSuccessAlert(
            'Rechazado',
            '!Se han rechazado los soprtes!'
          );
          this.cargarTablaCumplidos()
        })
        .catch((error) => {
          this.alertService.showErrorAlert('Error al Rechazar el cumplido');
          console.log(error);
        });
    } else {
    }
  }

  obtenerEstadoId(codigoAbreviacion: string): Observable<number | null> {
    return this.cumplidos_provedore_mid_service
      .get(`/estado_cumplido?query=CodigoAbreviación:${codigoAbreviacion}`)
      .pipe(
        map((response: any) => {
          if (response.Data != null && response.Data.length > 0) {
            return response.Data[0].Id;
          }
          return null;
        }),
        catchError((error) => {
          this.alertService.showCancelAlert('Se genero un error', error);
          return of(null);
        })
      );
  }

  obternerIdTipoDocumento(codigoAbreviacion: string) {
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
          this.alertService.showCancelAlert('Se genero un error', error);
          return of(null);
        })
      );
  }
}
