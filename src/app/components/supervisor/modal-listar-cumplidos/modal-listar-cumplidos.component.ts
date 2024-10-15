import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { TranslateService } from '@ngx-translate/core';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { CumplidosProveedoresCrudService } from 'src/app/services/cumplidos_proveedores_crud.service';
import { BodyCambioEstado } from 'src/app/models/revision_cumplidos_proveedores_mid/body_cambio_estado.model';
import { UserService } from 'src/app/services/user.services';
import { MatDialog } from '@angular/material/dialog';
import { CambioEstadoService } from 'src/app/services/cambio_estado_service';
import { CrearSolicitudCumplido } from 'src/app/models/crear-solicitud-cumplido.model';
import { AdministrativaAmazonService } from 'src/app/services/administrativa_amazon.service';

import {
  Mode,
  RolUsuario,
  ModalSoportesCumplidoData,
  ModalComentariosSoporteData,
  ConfigSoportes,
} from 'src/app/models/modal-soporte-cumplido-data.model';
import { ModalSoportesCumplidoComponent } from '../../general-components/modal-soportes-cumplido/modal-soportes-cumplido.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ModalVisualizarSoporteComponent } from '../../general-components/modal-visualizar-soporte/modal-visualizar-soporte.component';
import { ModoService } from 'src/app/services/modo_service.service';
import { ModalComentariosSoporteComponent } from '../../general-components/modal-comentarios-soporte/modal-comentarios-soporte.component';
import Swal from 'sweetalert2';
import { JbpmService } from 'src/app/services/jbpm_service.service';
import { SoportesService } from 'src/app/services/soportes.service';
import { InformacionSoporteCumplido } from 'src/app/models/revision_cumplidos_proveedores_mid/informacion_soporte_cumplido.model';

@Component({
  selector: 'app-modal-listar-cumplidos',
  templateUrl: './modal-listar-cumplidos.component.html',
  styleUrls: ['./modal-listar-cumplidos.component.scss'],
})
export class ModalListarCumplidosComponent {
  documento_supervisor!: string;
  numeroContrato!: string;
  vigencia!: string;
  solicitudes_contrato!: any;
  dataSource: any[] = [];
  newCumplidoProveedor!: CrearSolicitudCumplido;
  newCambioEstado!: BodyCambioEstado;
  loading: boolean = true;
  cargoSupervisor!: string;
  soportes!: InformacionSoporteCumplido[];
  informeDeSatisfacion: boolean = false;

  constructor(
    private cumplidosMidServices: CumplidosProveedoresMidService,
    private popUpManager: PopUpManager,
    private translate: TranslateService,
    private cumplidosCrudService: CumplidosProveedoresCrudService,
    private user: UserService,
    public dialog: MatDialog,
    private cambioEstadoService: CambioEstadoService,
    private administrativaAmazonService: AdministrativaAmazonService,
    private modeService: ModoService,
    private jbpmService: JbpmService,
    private soporteService: SoportesService
  ) {
    this.documento_supervisor = user.getPayload().documento;
  }

  async ngOnInit() {
    this.cumplidosMidServices.contrato$.subscribe((contrato) => {
      console.log(contrato);
      if (contrato) {
        this.numeroContrato = contrato.numeroContrato;
        this.vigencia = contrato.vigencia;

        this.getSolicitudesContrato(this.numeroContrato, this.vigencia);
      }
    });
  }

  obtenerSupervisorContrato() {
    this.jbpmService
      .get(
        `/informacion_supervisor_contrato/${this.numeroContrato}/${this.vigencia}`
      )
      .subscribe({
        next: (res: any) => {
          console.log('Respuesta:', res);
          if (
            res &&
            res.contratos &&
            res.contratos.supervisor &&
            res.contratos.supervisor.length > 0
          ) {
            console.log(
              'DocumentoSupervisor:',
              res.contratos.supervisor[0].cargo
            );
            this.cargoSupervisor = res.contratos.supervisor[0].cargo;
          } else {
            this.cargoSupervisor = 'Supervisor';
          }
        },
        error: (error: any) => {
          this.cargoSupervisor = 'Supervisor';
        },
      });
  }

  async getSolicitudesContrato(
    numero_contrato: string,
    vigencia_contrato: string
  ) {
    this.popUpManager.showLoadingAlert(
      'Cargando',
      'Por favor, espera mientras se cargan la solicitudes disponibles.'
    );
    this.cumplidosMidServices.contrato$.subscribe((contrato) => {
      if (contrato) {
        this.cumplidosMidServices
          .get(
            '/supervisor/solicitudes-contrato/' +
              numero_contrato +
              '/' +
              vigencia_contrato
          )
          .subscribe({
            next: (res: any) => {
              var count = 1;
              this.solicitudes_contrato = res.Data;
              this.dataSource = this.solicitudes_contrato.map(
                (solicitud: any) => {
                  return {
                    noSolicitud: solicitud.ConsecutivoCumplido,
                    numeroContrato:
                      solicitud.CumplidoProveedorId.NumeroContrato,
                    fechaCreacion: new Date(solicitud.FechaCreacion),
                    periodo: solicitud.Periodo,
                    estadoSoliciatud: solicitud.EstadoCumplido,
                    CodigoAbreviacionEstadoCumplido:
                      solicitud.CodigoAbreviacionEstadoCumplido,
                    cumplidoProveedor: solicitud.CumplidoProveedorId,
                    acciones: [
                      {
                        icon: 'folder_open',
                        actionName: 'folder_open',
                        isActive: true,
                      },
                      {
                        icon: 'send',
                        actionName: 'send',
                        isActive:
                          solicitud.CodigoAbreviacionEstadoCumplido === 'CD' ||
                          solicitud.CodigoAbreviacionEstadoCumplido === 'RO' ||
                          solicitud.CodigoAbreviacionEstadoCumplido === 'RC',
                      },
                    ],
                  };
                  this.loading = false;
                }
              );

              this.loading = false;
            },
            error: (error: any) => {
              Swal.close;
              this.loading = false;
              this.popUpManager.showErrorAlert(
                'El proveedor no tiene ninguna solicitud reciente.'
              );
            },
            complete: () => {
              Swal.close();
            },
          });
      }
    });
  }

  displayedColumns: any[] = [
    { def: 'noSolicitud', header: 'N° SOLICITUD' },
    { def: 'numeroContrato', header: 'N° CONTRATO' },
    { def: 'fechaCreacion', header: 'FECHA CREACION' },
    { def: 'periodo', header: 'PERIODO' },
    { def: 'estadoSoliciatud', header: 'ESTADO SOLICITUD' },
    {
      def: 'acciones',
      header: 'ACCIONES',
      isAction: true,
    },
  ];

  async obtenerCodigoAbreviacionCumplido(idCumplido: number): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log(idCumplido);
    });
  }

  async crearCumplidoProveedor() {
    await this.obtenerSupervisorContrato();
    this.newCumplidoProveedor = {
      NumeroContrato: this.numeroContrato,
      VigenciaContrato: Number(this.vigencia),
      CargoResponsable: this.cargoSupervisor,
      DocumentoResponsable: Number(this.documento_supervisor),
    };
    await this.cumplidosCrudService
      .post('/crear_solicitud_cumplido', this.newCumplidoProveedor)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.popUpManager.showSuccessAlert(
            'El cumplido se ha creado correctamente.'
          );
          this.getSolicitudesContrato(this.numeroContrato, this.vigencia);
        },
        error: (error: any) => {
          this.popUpManager.showErrorAlert(
            'No fue posible crear la solicitud de pago.'
          );
        },
      });
  }

  openDialog(cumplido: any) {
    console.log('cumplido', cumplido);
    const dialog = this.dialog.open(ModalSoportesCumplidoComponent, {
      disableClose: true,
      height: 'auto',
      width: 'auto',
      maxWidth: '60vw',
      maxHeight: '80vh',
      data: {
        CumplidoProveedorId: cumplido.cumplidoProveedor.Id,
        Buttons: [
          {
            Color: 'white',
            FontIcon: 'clear',
            Classes: 'eliminar-documento-button',
            Text: 'Eliminar',
          },
          {
            Color: 'white',
            FontIcon: 'chat',
            Classes: 'comentarios-documento-button',
            Text: 'Comentarios',
          },
          {
            Color: 'white',
            FontIcon: 'visibility',
            Classes: 'ver-documentos-button',
            Text: 'Ver',
          },
        ],
        Config: {
          mode: this.modeService.obtenerModo(
            cumplido.CodigoAbreviacionEstadoCumplido
          ),
          rolUsuario: RolUsuario.S,
        },
      } as ModalSoportesCumplidoData,
    });
  }

  async cargarSoportes(cumplido: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.soporteService.getDocumentosCumplidos(cumplido).subscribe({
        next: (soportes: InformacionSoporteCumplido[]) => {
          this.soportes = soportes;
          console.log(this.soportes);
          this.informeDeSatisfacion = this.soportes.some(
            (doc) => doc.Documento.CodigoAbreviacionTipoDocumento === 'IS'
          );

          resolve(this.informeDeSatisfacion);
        },
        error: (error: any) => {
          console.log(error);
          this.soportes = [];
          resolve(false);
        },
      });
    });
  }

  async cambiarEstado(cumplido: any) {
    let confirm = await this.popUpManager.showConfirmAlert(
      '¿Estás seguro de enviar a revisión este cumplido?'
    );
    await this.cargarSoportes(cumplido.cumplidoProveedor.Id);

    console.log(this.informeDeSatisfacion);
    if (confirm.isConfirmed) {
      if (this.informeDeSatisfacion) {
        this.cambioEstadoService
          .cambiarEstado(cumplido.cumplidoProveedor.Id, 'PRC')
          .then(() => {
            this.popUpManager
              .showSuccessAlert('Los soportes se han aprobado correctamente.')
              .then(() => {
                this.getSolicitudesContrato(
                  cumplido.cumplidoProveedor.NumeroContrato,
                  cumplido.cumplidoProveedor.VigenciaContrato
                );
              });
          });
      } else {
        this.popUpManager.showErrorAlert(
          'No se puede enviar porque no hay Cumplido a satisfacción'
        );
      }
    }
  }

  handleActionClick(event: { action: any; element: any }) {
    if (event.action.actionName === 'folder_open') {
      this.openDialog(event.element);
    } else if (event.action.actionName === 'send') {
      this.cambiarEstado(event.element);
    }
  }
}
