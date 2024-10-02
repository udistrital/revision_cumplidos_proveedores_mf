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
} from 'src/app/models/modal-soporte-cumplido-data.model';
import { ModalSoportesCumplidoComponent } from '../../general-components/modal-soportes-cumplido/modal-soportes-cumplido.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ModalVisualizarSoporteComponent } from '../../general-components/modal-visualizar-soporte/modal-visualizar-soporte.component';
import { ModoService } from 'src/app/services/modo_service.service';

@Component({
  selector: 'app-modal-listar-cumplidos',
  templateUrl: './modal-listar-cumplidos.component.html',
  styleUrls: ['./modal-listar-cumplidos.component.scss'],
})
export class ModalListarCumplidosComponent {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  documento_supervisor!: string;
  numeroContrato!: string;
  vigencia!: string;
  solicitudes_contrato!: any;
  dataSource: any[] = [];
  newCumplidoProveedor!: CrearSolicitudCumplido;
  newCambioEstado!: BodyCambioEstado;
  loading: boolean = true;


  constructor(
    private cumplidosMidServices: CumplidosProveedoresMidService,
    private popUpManager: PopUpManager,
    private translate: TranslateService,
    private cumplidosCrudService: CumplidosProveedoresCrudService,
    private user: UserService,
    public dialog: MatDialog,
    private cambioEstadoService: CambioEstadoService,
    private administrativaAmazonService: AdministrativaAmazonService,
    private modeService:ModoService,
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
        this.newCumplidoProveedor = {
          NumeroContrato: this.numeroContrato,
          VigenciaContrato: Number(this.vigencia),
          CargoResponsable: contrato.Contrato.NombreDependencia,
          DocumentoResponsable: Number(this.documento_supervisor),
        };

        this.administrativaAmazonService
          .get(
            '/contrato_general/?query=ContratoSuscrito.NumeroContratoSuscrito:' +
              this.numeroContrato +
              ',VigenciaContrato:' +
              this.vigencia
          )
          .subscribe({
            next: (res: any) => {
              console.log(res);
              this.newCumplidoProveedor.CargoResponsable =
                res[0].Supervisor.Cargo;
            },
            error: (error: any) => {
              this.popUpManager.showErrorAlert(
                'Error al intentar obtener los datos del supervisor.'
              );
            },
          });
      }
    });
  }

  async getSolicitudesContrato(numero_contrato: string, vigencia_contrato: string) {
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
                  console.log(res.Data, '..Dataparalafecha');
                  return {
                    noSolicitud: solicitud.ConsecutivoCumplido,
                    numeroContrato: solicitud.CumplidoProveedorId.NumeroContrato,
                    fechaCreacion: new Date(solicitud.FechaCreacion),
                    periodo: solicitud.Periodo,
                    estadoSoliciatud: solicitud.EstadoCumplido,
                    CodigoAbreviacionEstadoCumplido: solicitud.CodigoAbreviacionEstadoCumplido,
                    cumplidoProveedor: solicitud.CumplidoProveedorId,
                    acciones: [
                      { icon: 'folder_open', actionName: 'folder_open', isActive: true },
                      {
                        icon: 'send',
                        actionName: 'send',
                        isActive: solicitud.CodigoAbreviacionEstadoCumplido === 'CD' || solicitud.CodigoAbreviacionEstadoCumplido === 'RO' || solicitud.CodigoAbreviacionEstadoCumplido === 'RC'
                      },
                    ],
                  };
                  this.loading = false;
                }
              );
              this.loading = false;
            },
            error: (error: any) => {
              this.loading = false;
              this.popUpManager.showErrorAlert(
                'El proveedor no tiene ninguna solicitud reciente.'
              );
            },
          });
      }
    });
  }


  displayedColumns: any[] = [
    {def: 'noSolicitud', header: 'N° SOLICITUD' },
    {def: 'numeroContrato', header: 'N° CONTRATO' },
    {def: 'fechaCreacion', header: 'FECHA CREACION' },
    {def: 'periodo', header: 'PERIODO' },
    {def: 'estadoSoliciatud', header: 'ESTADO SOLICITUD' },
    {
      def: 'acciones',
      header: 'ACCIONES',
      isAction: true,
    }
  ];

  async obtenerCodigoAbreviacionCumplido(idCumplido: number): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log(idCumplido)
    });
  }


  async crearCumplidoProveedor() {
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
      maxHeight: '80vw',
      maxWidth: '100vw',
      height: '80vh',
      width: '80vw',
      data: {
        CumplidoProveedorId: cumplido.cumplidoProveedor.Id,
        Buttons: [
          {
            Color: 'white',
            FontIcon: 'visibility',
            Function: (file: any) => {
            const visualizarSoporetes=   this.dialog.open(ModalVisualizarSoporteComponent, {
                disableClose: true,
                height: 'auto',
                width: 'auto',
                maxWidth: '60vw',
                maxHeight: '80vh',
                panelClass: 'custom-dialog-container',
                data: {
                  url: file.Archivo.File,
                },
              });
            },
            Classes: 'ver-documentos-button',
            Text: 'Ver',
          },
        ],
        Config: {
          mode: this.modeService.obtenerModo(cumplido.CodigoAbreviacionEstadoCumplido),
          rolUsuario: RolUsuario.S,
        },
      } as ModalSoportesCumplidoData,
    });
  }



  async cambiarEstado(cumplido: any) {
    let confirm = await this.popUpManager.showConfirmAlert(
      '¿Está seguro de que desea aprobar los soportes?'
    );
    console.log(cumplido);
    if (confirm.isConfirmed) {
      await this.cambioEstadoService.cambiarEstado(
        cumplido.cumplidoProveedor.Id,
        'PRC'
      );
      this.popUpManager.showSuccessAlert(
        'Los soportes se han aprobado correctamente.'
      );
      setTimeout(async () => {
        await this.getSolicitudesContrato(
            cumplido.cumplidoProveedor.NumeroContrato,
            cumplido.cumplidoProveedor.VigenciaContrato
        );
        this.dataSource = [...this.dataSource];
    }, 1000);
    } 
  }

  handleActionClick(event: {action: any, element: any}) {
    if (event.action.actionName === 'folder_open') {
      this.openDialog(event.element);
    } else if (event.action.actionName === 'send'){
      this.cambiarEstado(event.element)
    }
  }
}
