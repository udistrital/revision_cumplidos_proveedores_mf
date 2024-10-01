import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, map, Observable, of } from 'rxjs';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { CumplidosProveedoresCrudService } from 'src/app/services/cumplidos_proveedores_crud.service';
import Swal from 'sweetalert2';
import { CambioEstadoService } from 'src/app/services/cambio_estado_service';
import { UserService } from 'src/app/services/user.services';
import { ModalSoportesCumplidoComponent } from 'src/app/components/general-components/modal-soportes-cumplido/modal-soportes-cumplido.component';
import { Mode, RolUsuario, ModalSoportesCumplidoData } from 'src/app/models/modal-soporte-cumplido-data.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ModalVisualizarSoporteComponent } from '../../general-components/modal-visualizar-soporte/modal-visualizar-soporte.component';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { TablaRevisionCumplido } from 'src/app/models/revision_cumplidos_proveedores_mid/tabla_revision_cumplido';
import { InformacionSoporteCumplido } from 'src/app/models/revision_cumplidos_proveedores_mid/informacion_soporte_cumplido.model';
import { NotificacionesService } from './../../../services/notificaciones.service';




@Component({
  selector: 'app-revision-cumplidos-contratacion',
  templateUrl: './revision-cumplidos-contratacion.component.html',
  styleUrls: ['./revision-cumplidos-contratacion.component.scss'],
})
export class RevisionCumplidosContratacionComponent {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  soporte_cumplido: InformacionSoporteCumplido[] = [];
  documentoResponsable: string = '';
  nombreContratacion!: string;
  dataSource: TablaRevisionCumplido[] = [];
  loading: boolean = true;


  constructor(
    public dialog: MatDialog,
    private cumplidos_provedore_crud_service: CumplidosProveedoresCrudService,
    private cumplidos_provedore_mid_service: CumplidosProveedoresMidService,
    private cambioEstadoService: CambioEstadoService,
    private userService: UserService,
    private popUpManager: PopUpManager,
    private  notificacionesService:NotificacionesService

  ) {
    this.obtenerInfoPersona();
    this.cargarTablaCumplidos();
  }



  ngOnInit(): void {
     this.obtenerInfoPersona();
   }

  displayedColumns = [
    {def:  'NumeroContrato', header: 'N° CONTRATO'},
    {def:  'VigenciaContrato', header: 'VIGENCIA'},
    {def:  'Rp', header: 'RP'},
    {def:  'VigenciaRP', header: 'VIGENCIA RP'},
    {def:  'FechaCreacion', header: 'FECHA CREACION'},
    {def:  'NombreProveedor', header: 'PROVEEDOR'},
    {def:  'Dependencia', header: 'DEPENDENCIA'},
    {def: 'acciones', header: 'ACCIONES', isAction: true}
  ];

  async cargarTablaCumplidos() {
    this.dataSource = [];
    this.popUpManager.showLoadingAlert(
      'Cargando',
      'Espera mientras se cargan las solicitudes pendientes'
    );
    this.cumplidos_provedore_mid_service
      .get('/contratacion/solicitudes-pago/')
      .subscribe({
        next: (res: any) => {
          Swal.close();
          if (res.Data != null && res.Data.length > 0){
            this.dataSource = res.Data.map(
              (solicitud: any) => {
                return {
                  ...solicitud,
                  acciones: [
                    {icon: 'visibility', actionName: 'visibility', isActive: true},
                    {icon: 'check', actionName: 'check', isActive: true},
                    {icon: 'close', actionName: 'close', isActive: true}
                  ]
                }
              }
            )
            this.loading = false;
          } else {
            this.popUpManager.showAlert('Sin cumplidos pendientes', 'No hay cumplidos pendientes para revisión por parte de contratación');
            this.dataSource = [];
            this.loading = false;
          }
        },
        error: (error: any) => {
          Swal.close();
          this.loading = false;
          this.popUpManager.showAlert('Sin cumplidos pendientes', 'No hay cumplidos pendientes para revision por parte de contratación');
          console.error(error);
        }
      })

  }

  async obtenerInfoPersona() {
    this.userService.obtenerInformacionPersona().subscribe({
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

  obtenerSoportes(idCumplido: number) {
    console.log(idCumplido);
    this.popUpManager.showLoadingAlert(
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
                Buttons: [
                  {
                    Color: 'white',
                    FontIcon: 'visibility',
                    Function: (file: any) => {
                    const visualizarSoporetes=   this.dialog.open(ModalVisualizarSoporteComponent, {
                        disableClose: true,
                        height: '70vh',
                        width: '50vw',
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
                Config:{
                  mode:Mode.PRC,
                  rolUsuario:RolUsuario.C,

                }
              } as ModalSoportesCumplidoData
            });
          }
        },
        (error) => {
          Swal.close();
          this.popUpManager.showAlert(
            'Cumplido sin soportes',
            'No se encontraron soportes para este cumplido'
          );
          console.log('error', error);
        }
      );
  }

  async aprobarSoportes(cumplido: any) {
    console.log(cumplido);
    let confirm = await this.popUpManager.showConfirmAlert(
      '¿Está seguro de aprobar los soportes?'
    );

    if (confirm.isConfirmed) {

      try {
        await this.cambioEstadoService.cambiarEstado(cumplido.CumplidoId, 'AC');
        this.popUpManager.showSuccessAlert(
          '!Se han aprobado los soportes del cumplido!'
        );
        this.notificacionesService.publicarNotificaciones("AC","/informacion_ordenador_contrato/"+cumplido.NumeroContrato+"/"+cumplido.VigenciaContrato)
        setTimeout(async () => {
          await this.cargarTablaCumplidos();
          this.dataSource = [...this.dataSource]
        }, 1000)


      } catch (error) {
        this.popUpManager.showErrorAlert('Error al aprobar los soportes');
        console.error(error);
      }
    }
  }

  async rechazarSoportes(cumplido: any) {
    console.log('Objeto', cumplido);
    let confirm = await this.popUpManager.showConfirmAlert(
      '¿Está seguro de rechazar los soportes?'
    );
    if (confirm.isConfirmed) {
      try {
        await this.cambioEstadoService.cambiarEstado(cumplido.CumplidoId, 'RC');
        this.popUpManager.showSuccessAlert(
          '!Se han rechazado los soportes!'
        );
        this.notificacionesService.publicarNotificaciones("RC","/informacion_supervisor_contrato/"+cumplido.NumeroContrato+"/"+cumplido.VigenciaContrato)
        setTimeout(async () => {
          await this.cargarTablaCumplidos();
          this.dataSource = [...this.dataSource]
        }, 1000)
      } catch (error) {
        this.popUpManager.showErrorAlert('Error al rechazar los soportes del cumplido');
        console.error(error);
      }
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
          this.popUpManager.showErrorAlert('Error al obtener el estado del cumplido');
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
          this.popUpManager.showErrorAlert('Error al obtener los tipos de documentos del cumplido');
          return of(null);
        })
      );
  }

  handleActionClick(event: {action: any, element: any}) {
    if (event.action.actionName === 'visibility') {
      this.obtenerSoportes(event.element.CumplidoId);
    } else if (event.action.actionName === 'check'){
      this.aprobarSoportes(event.element)
    } else if (event.action.actionName === 'close'){
      this.rechazarSoportes(event.element)
    }
  }
}
