import { Component, ViewChild } from '@angular/core';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { TranslateService } from '@ngx-translate/core';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { BodyCumplidoProveedor } from 'src/app/models/CargaSoportes/body_cumplido_proveedor.model';
import { CumplidosProveedoresCrudService } from 'src/app/services/cumplidos_proveedores_crud.service';
import { BodyCambioEstado } from 'src/app/models/CargaSoportes/body_cambio_estado.model';
import { UserService } from 'src/app/services/user.services';
import { MatDialog } from '@angular/material/dialog';
import { CambioEstadoService } from 'src/app/services/cambio_estado_service';
import { AletManagerService } from 'src/app/managers/alert-manager.service';
import { CrearSolicitudCumplido } from 'src/app/models/crear-solicitud-cumplido.model';
import { AdministrativaAmazonService } from 'src/app/services/administrativa_amazon.service';
import { Mode, RolUsuario, ModalSoportesCumplidoData } from 'src/app/models/modal-soporte-cumplido-data.model';
import { ModalSoportesCumplidoComponent } from '../../general-components/modal-soportes-cumplido/modal-soportes-cumplido.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EstadoCumplido } from 'src/app/models/basics/estado-cumplido.model';

@Component({
  selector: 'app-modal-carga-soprotes',
  templateUrl: './modal-carga-soprotes.component.html',
  styleUrls: ['./modal-carga-soprotes.component.css'],
})
export class ModalCargaSoprotesComponent {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  documento_supervisor!: string;
  numeroContrato!: string;
  vigencia!: string;
  solicitudes_contrato!: any;
  dataSource: any[] = [];
  newCumplidoProveedor!: CrearSolicitudCumplido;
  newCambioEstado!: BodyCambioEstado;
  data!: any;

  constructor(
    private cumplidosMidServices: CumplidosProveedoresMidService,
    private popUpManager: PopUpManager,
    private translate: TranslateService,
    private cumplidosCrudService: CumplidosProveedoresCrudService,
    private user: UserService,
    public dialog: MatDialog,
    private cambioEstadoService: CambioEstadoService,
    private alertService: AletManagerService,
    private administrativaAmazonService: AdministrativaAmazonService
  ) {
    this.documento_supervisor = user.getPayload().documento;
  }

  ngOnInit() {
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
                'El Proveedor no tiene ninguna solicitud reciente'
              );
            },
          });
      }
    });
  }

  getSolicitudesContrato(numero_contrato: string, vigencia_contrato: string) {
    console.log(numero_contrato);
    console.log(vigencia_contrato);
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
                    noSolicitud: count++,
                    numeroContrato:
                      solicitud.CumplidoProveedorId.NumeroContrato,
                    fechaCreacion: new Date(solicitud.FechaCreacion),
                    periodo: solicitud.Periodo,
                    estadoSoliciatud: solicitud.EstadoCumplido,
                    acciones: 'Editar, Eliminar',
                    cumplidoProveedor: solicitud.CumplidoProveedorId,
                  };
                }
              );
              this.data = new MatTableDataSource<any>(this.dataSource);
              this.data.paginator = this.paginator;
              this.data.sort = this.sort;
            },
            error: (error: any) => {
              this.data = new MatTableDataSource<any>(this.dataSource);
              this.data.paginator = this.paginator;
              this.data.sort = this.sort;
              this.popUpManager.showErrorAlert(
                'El Proveedor no tiene ninguna solicitud reciente'
              );
            },
          });
      }
    });
  }

  displayedColumns: string[] = [
    'noSolicitud',
    'numeroContrato',
    'fechaCreacion',
    'periodo',
    'estadoSoliciatud',
    'acciones',
  ];

  crearCumplidoProveedor() {
    this.cumplidosCrudService
      .post('/crear_solicitud_cumplido', this.newCumplidoProveedor)
      .subscribe({
        next: (res: any) => {
          console.log(res)
          this.popUpManager.showSuccessAlert(
            'Se ha creado el cumplido correctamente'
          );
          this.getSolicitudesContrato(this.numeroContrato, this.vigencia);
        },
        error: (error: any) => {
          this.popUpManager.showErrorAlert(
            'No fue Posible crear la solicitud de pago'
          );
        },
      });
  }

  openDialog(cumplido: any) {
    this.cambioEstadoService.obtenerEstadoCumplido(cumplido.cumplidoProveedor.Id).subscribe({
      next: (res: any) => {
        console.log('cumplido', cumplido);
        this.dialog.open(ModalSoportesCumplidoComponent, {
          disableClose: true,
          maxHeight: '80vw',
          maxWidth: '100vw',
          height: '80vh',
          width: '80vw',
          data:{
            CumplidoProveedorId:cumplido.cumplidoProveedor.Id,
            Config:{
              mode:this.obtenerModo(res.CodigoAbreviacion),
              rolUsuario:RolUsuario.S
            }
          } as ModalSoportesCumplidoData
        });
      },
      error: (error: any) => {
        this.popUpManager.showErrorAlert(
          'No fue Posible obtener el estado del cumplido'
        );
      },
    });
  }

  obtenerModo(codigoAbreviacionCumplido: string): Mode{
    switch (codigoAbreviacionCumplido) {
      case 'CD':
        return Mode.CD;
      case 'RC':
        return Mode.PRC;
      case 'RO':
        return Mode.RO;
      case 'AO':
        return Mode.AO;
      case 'PRO':
        return Mode.PRO;
      default:
        return Mode.PRC;

  }
}

  async cambiarEstado(idCumplido: any) {
    let confirm = await this.alertService.alertConfirm(
      '¿Esta seguro de aprobar los soportes?'
    );
    console.log(idCumplido);
    if (confirm.isConfirmed) {
      this.cambioEstadoService.cambiarEstado(
        idCumplido.cumplidoProveedor.Id,
        'PRC'
      );
    } else {
      this.alertService.showCancelAlert(
        'Cancelado',
        'No se ha relizado ninguna accion'
      );
    }

    this.getSolicitudesContrato(
      idCumplido.cumplidoProveedor.NumeroContrato,
      idCumplido.cumplidoProveedor.VigenciaContrato
    );
  }
}
