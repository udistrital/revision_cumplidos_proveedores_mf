import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { catchError, lastValueFrom, map, Observable, of } from 'rxjs';
import { SolicituDeFirma } from 'src/app/models/certificado-pago.model';
import { CumplidosProveedoresCrudService } from 'src/app/services/cumplidos_proveedores_crud.service';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.services';
import { CambioEstadoService } from 'src/app/services/cambio_estado_service';
import { ModalSoportesCumplidoComponent } from 'src/app/components/general-components/modal-soportes-cumplido/modal-soportes-cumplido.component';
import {
  Mode,
  RolUsuario,
  ModalSoportesCumplidoData,
} from 'src/app/models/modal-soporte-cumplido-data.model';
import { ModalVisualizarSoporteComponent } from 'src/app/components/general-components/modal-visualizar-soporte/modal-visualizar-soporte.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ModoService } from 'src/app/services/modo_service.service';
import { FirmaElectronicaService } from 'src/app/services/firma_electronica_mid.service';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { BodyCambioEstado } from 'src/app/models/revision_cumplidos_proveedores_mid/body_cambio_estado.model';
import { TablaRevisionCumplido } from 'src/app/models/revision_cumplidos_proveedores_mid/tabla_revision_cumplido';
import { InformacionSoporteCumplido } from 'src/app/models/revision_cumplidos_proveedores_mid/informacion_soporte_cumplido.model';
import { NotificacionesService } from 'src/app/services/notificaciones.service';

@Component({
  selector: 'app-revision-cumplidos-ordenador',
  templateUrl: './revision-cumplidos-ordenador.component.html',
  styleUrls: ['./revision-cumplidos-ordenador.component.scss'],
})
export class RevisionCumplidosOrdenadorComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  pdfBase64: string = '';
  solicituDeFirma!: SolicituDeFirma;
  soporte_cumplido: InformacionSoporteCumplido[] = [];
  documentoResponsable: string = '';
  nombreResponsable: string = '';
  data!: any;
  dataSource: TablaRevisionCumplido[] = [];
  loading: boolean = true;
  nombreOrdenador: string = '';
  constructor(
    public dialog: MatDialog,
    private cumplidos_provedore_crud_service: CumplidosProveedoresCrudService,
    private cumplidos_provedore_mid_service: CumplidosProveedoresMidService,
    private cambioEstadoService: CambioEstadoService,
    private userService: UserService,
    private popUpManager: PopUpManager,
    private modeService: ModoService,
    private firmaElectronica: FirmaElectronicaService,
    private notificacionesService: NotificacionesService
  ) {}
  ngOnInit(): void {
    this.documentoResponsable = this.userService.getPayload().documento;
    this.CargarTablaCumplidos();
    this.nombreResponsable = this.userService.getPayload().sub;
    this.obtenerInfoPersona();
  }

  displayedColumns = [
    { def: 'NumeroContrato', header: 'N° CONTRATO' },
    { def: 'VigenciaContrato', header: 'VIGENCIA' },
    { def: 'Rp', header: 'RP' },
    { def: 'VigenciaRP', header: 'VIGENCIA RP' },
    { def: 'FechaCreacion', header: 'FECHA CREACION' },
    { def: 'NombreProveedor', header: 'PROVEEDOR' },
    { def: 'Dependencia', header: 'DEPENDENCIA' },
    { def: 'acciones', header: 'ACCIONES', isAction: true },
  ];

  CargarTablaCumplidos() {
    this.dataSource = [];
    this.popUpManager.showLoadingAlert(
      'Cargando',
      'Espera mientras se cargan las solicitudes pendientes'
    );
    this.cumplidos_provedore_mid_service
      .get('/ordenador/solicitudes-pago/' + this.documentoResponsable)
      .subscribe({
        next: (res: any) => {
          Swal.close();
          if (res.Data != null && res.Data.length > 0) {
            this.dataSource = res.Data.map((solicitud: any) => {
              return {
                ...solicitud,
                acciones: [
                  {
                    icon: 'visibility',
                    actionName: 'visibility',
                    isActive: true,
                  },
                  { icon: 'check', actionName: 'check', isActive: true },
                  { icon: 'close', actionName: 'close', isActive: true },
                ],
              };
            });
            this.loading = false;
          } else {
            this.popUpManager.showAlert(
              'Sin cumplidos pendientes',
              'No hay cumplidos pendientes para revision por parte del ordenador'
            );
            this.dataSource = [];
            this.loading = false;
          }
        },
        error: (error: any) => {
          Swal.close();
          this.loading = false;
          this.popUpManager.showAlert(
            'Sin cumplidos pendientes',
            'No hay cumplidos pendientes para revision por parte del ordenador'
          );
          console.error(error);
        },
      });
  }


  ListarSoportes(idCumplido: any) {
    const dialog = this.dialog.open(ModalSoportesCumplidoComponent, {
      disableClose: true,
      maxHeight: '80vw',
      maxWidth: '60vw',
      height: '80vh',
      width: '80vw',
      data: {
        CumplidoProveedorId: idCumplido,
        Buttons: [
          {
            Color: 'white',
            FontIcon: 'visibility',
            Function: (file: any) => {
              const visualizarSoporetes = this.dialog.open(
                ModalVisualizarSoporteComponent,
                {
                  disableClose: true,
                  height: '70vh',
                  width: '50vw',
                  maxWidth: '60vw',
                  maxHeight: '80vh',
                  panelClass: 'custom-dialog-container',
                  data: {
                    url: file.Archivo.File,
                  },
                }
              );
            },
            Classes: 'ver-documentos-button',
            Text: 'Ver',
          },
        ],
        Config: {
          mode: this.modeService.obtenerModo('RC'),
          rolUsuario: RolUsuario.O,
        },
      } as ModalSoportesCumplidoData,
    });
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

  async verAutorizacionDePago(cumplido: any) {
    this.popUpManager.showLoadingAlert(
      'Cargando',
      'Esperar mientras se genera el documento'
    );
    try {
      const autorizacionPago = await lastValueFrom(
        this.GenerarAutotizacionDePago(cumplido.CumplidoId)
      );

      if (autorizacionPago != null) {
        Swal.close();
        this.modalVerSoporte(cumplido);
      }
    } catch (error) {
      this.popUpManager.showErrorAlert('Error al generar autoriacion de pago');
    }
  }

  async rechazarCumplido(Cumplido: any) {
    let x = await this.popUpManager.showConfirmAlert(
      '¿Esta seguro de Rechazar los soportes?'
    );
    if (x.isConfirmed) {
      await this.cambiarEstado(Cumplido.CumplidoId, 'RO');
      this.popUpManager.showSuccessAlert('!Se han rechazado los soprtes!');
      setTimeout(async () => {
        await this.CargarTablaCumplidos();
        this.dataSource = [...this.dataSource];
      }, 1000);
    }
  }

  CambiarEstado(cambioEstado: BodyCambioEstado) {
    this.cumplidos_provedore_mid_service
      .post('/solicitud-pago/cambio-estado', cambioEstado)
      .subscribe(
        (response) => {
          console.log(cambioEstado);
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  ObtenerEstadoId(codigoAbreviacion: string): Observable<number | null> {
    return this.cumplidos_provedore_crud_service
      .get(`/estado_cumplido?query=CodigoAbreviación:${codigoAbreviacion}`)
      .pipe(
        map((response: any) => {
          if (response.Data != null && response.Data.length > 0) {
            return response.Data[0].Id;
          }
          return null;
        }),
        catchError((error) => {
          this.popUpManager.showErrorAlert('Error al ');
          return of(null);
        })
      );
  }

  GenerarAutotizacionDePago(
    cumplidoId: number
  ): Observable<SolicituDeFirma | null> {
    return this.cumplidos_provedore_mid_service
      .get('/ordenador/autorizacion-giro/' + cumplidoId)
      .pipe(
        map((response: any) => {
          if (response.Data != null) {
            this.solicituDeFirma = {
              NombreArchivo: response.Data.NombreArchivo,
              NombreResponsable: this.nombreOrdenador,
              CargoResponsable: 'Ordenador',
              DescripcionDocumento: response.Data.DescripcionDocumento,
              Archivo: response.Data.Archivo,
            };
            this.pdfBase64 = response.Data.Archivo;
            return this.solicituDeFirma;
          }
          return null;
        }),
        catchError((error) => {
          this.popUpManager.showErrorAlert(
            'Error al generar la autorización de pago.'
          );
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

  modalVerSoporte(cumplido: any) {
    this.dialog.open(ModalVisualizarSoporteComponent, {
      disableClose: true,
      height: '70vh',
      width: '40vw',
      maxWidth: '60vw',
      maxHeight: '80vh',
      panelClass: 'custom-dialog-container',
      data: {
        url: this.pdfBase64,
        cargoResponsable: 'Ordenador',
        ModalButtonsFunc: [
          {
            Color: '#8c1a19',
            Function: async () => {
              try {
                await this.firmaElectronica.firmarDocumento(
                  this.solicituDeFirma,
                  cumplido.CumplidoId,
                  168,
                  false
                  ,() => {
                    this.CargarTablaCumplidos();}
                );
                await this.cambioEstadoService.cambiarEstado(
                  cumplido.CumplidoId,
                  'AO'
                );
            
              } catch (error) {
                this.popUpManager.showErrorAlert('Error al Firmar Documento');
              }
            },
            Clases: '',
            Text: 'Firmar',
            TextColor: '#ffffff',
          },
        ],
      },
    });
  }

  async cambiarEstado(idCumplido: any, estado: string) {
    await this.cambioEstadoService.cambiarEstado(idCumplido, estado);
  }

  handleActionClick(event: { action: any; element: any }) {
    if (event.action.actionName === 'visibility') {
      this.ListarSoportes(event.element.CumplidoId);
    } else if (event.action.actionName === 'check') {
      this.verAutorizacionDePago(event.element);
    } else if (event.action.actionName === 'close') {
      this.rechazarCumplido(event.element);
    }
  }
}
