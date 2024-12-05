import { Component } from '@angular/core';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { CumplidosReversibles } from 'src/app/models/revision_cumplidos_proveedores_mid/cumplidos_reversibles.model';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { UserService } from 'src/app/services/user.services';
import Swal from 'sweetalert2';
import { ModalVisualizarSoporteComponent } from '../../general-components/modal-visualizar-soporte/modal-visualizar-soporte.component';
import { MatDialog } from '@angular/material/dialog';
import {Mode,RolUsuario,ModalSoportesCumplidoData,ConfigSoportes,} from 'src/app/models/modal-soporte-cumplido-data.model';
import { ModalSoportesCumplidoComponent } from '../../general-components/modal-soportes-cumplido/modal-soportes-cumplido.component';
import { ModoService } from 'src/app/services/modo_service.service';
import { CambioEstadoService } from 'src/app/services/cambio_estado_service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar-cumplidos-reversibles',
  templateUrl: './listar-cumplidos-reversibles.component.html',
  styleUrls: ['./listar-cumplidos-reversibles.component.scss']
})
export class ListarCumplidosReversiblesComponent {

  loading: boolean = true;
  documento_ordenador: string
  dataSource: CumplidosReversibles[] = [];
  displayedColumns = [
    {def:'NumeroContrato', header:'N° CONTRATO' },
    {def:'Vigencia', header: 'VIGENCIA'},
    {def:'Rp', header: 'RP'},
    {def:'VigenciaRp', header: 'VIGENCIA RP'},
    {def:'FechaAprobacion', header: 'FECHA APROBACIÓN'},
    {def:'NombreProveedor', header: 'NOMBRE PROVEEDOR'},
    {def:'Dependencia', header: 'DEPENDENCIA'},
    {def: 'acciones', header: 'ACCIONES', isAction: true },
  ];

  constructor(
    private cambioEstadoService: CambioEstadoService,
    public dialog: MatDialog,
    private cumplidosMidServices: CumplidosProveedoresMidService,
    private popUpManager: PopUpManager,
    private user: UserService,
    private modeService: ModoService,
    private router: Router,
  ){

    this.documento_ordenador = user.getPayload().documento;
  }

  title:string="REVERTIR CUMPLIDOS APROBADOS"




  ngOnInit() {
    this.obtenerCumplidosReversibles();
  }

  obtenerCumplidosReversibles(){
    this.dataSource = [];
    this.popUpManager.showLoadingAlert("Cargando", "Espera mientras se cargan los cumplidos reversibles para el ordenador")
    this.cumplidosMidServices.get('/ordenador/revertir-solicitud-pago/' + this.documento_ordenador)
      .subscribe({
        next: (res: any) => {
          Swal.close()
          this.dataSource = res.Data.map((cumplido: any) => {
            return {
              CumplidoId: cumplido.CumplidoId,
              NumeroContrato: cumplido.NumeroContrato,
              Vigencia: cumplido.VigenciaContrato,
              Rp: cumplido.Rp,
              VigenciaRp: cumplido.VigenciaRP,
              FechaAprobacion: cumplido.FechaCreacion,
              NombreProveedor: cumplido.NombreProveedor,
              Dependencia: cumplido.Dependencia,
              acciones: [
                {icon: 'visibility',actionName: 'visibility', isActive: true},
                {icon: 'close', actionName: 'close', isActive: true}
              ],
            };
          });
          this.loading = false;
        },
        error: (err: any) => {
          Swal.close()
          this.dataSource = [];
          this.loading = false;
          this.redirigirInicio()
        }
      });

  }

  redirigirInicio(){
    this.popUpManager.showAlert('Sin cumplidos reversibles','Por el momento no hay ningún cumplido reversible para el ordenador');
    setTimeout(() => {
      this.router.navigate(['/']);
      Swal.close()
    }, 3000);
  }

  ListarSoportes(idCumplido: any) {
    const dialog = this.dialog.open(ModalSoportesCumplidoComponent, {
      disableClose: true,
      height: 'auto',
      width: 'auto',
      maxWidth: '60vw',
      maxHeight: '80vh',
      minWidth: '30vw',
      minHeight: '40vh',
      data: {
        CumplidoProveedorId: idCumplido,
        Buttons: [
          {
            Color: 'white',
            FontIcon: 'chat',
            Classes: 'comentarios-documento-button',
            Text: 'Comentarios',
          },
          {
            Color: 'white',
            FontIcon: 'visibility',
            Function: (file: any) => {
              this.dialog.open(
                ModalVisualizarSoporteComponent,
                {
                  disableClose: true,
                  height: 'auto',
                  width: 'auto',
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
          }
        ],
        Config: {
          mode: this.modeService.obtenerModo('AO'),
          rolUsuario: RolUsuario.O,
        },
      } as ModalSoportesCumplidoData,
    });
  }

  async cambiarEstado(idCumplido: any, estado: string) {
    await this.cambioEstadoService.cambiarEstado(idCumplido, estado);
  }

  async rechazarCumplido(Cumplido: any) {
    let x = await this.popUpManager.showConfirmAlert(
      '¿Está seguro de que desea revertir el cumplido?'
    );
    if (x.isConfirmed) {
      await this.cambiarEstado(Cumplido.CumplidoId, 'RO');
      this.popUpManager.showSuccessAlert(
        '¡Se ha revertdio el cumplido!'
      );
      setTimeout(async () => {
        await this.obtenerCumplidosReversibles();
        this.dataSource = [...this.dataSource];
      }, 1000);
    }
  }



  dataVacio(){
    return this.dataSource.length === 0;
  }

  handleActionClick(event: { action: any; element: any }) {
    if (event.action.actionName === 'visibility') {
      this.ListarSoportes(event.element.CumplidoId);
    } else if (event.action.actionName === 'close') {
      this.rechazarCumplido(event.element);
    }
  }
}
