import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalListarCumplidosComponent } from '../modal-listar-cumplidos/modal-listar-cumplidos.component';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { UserService } from 'src/app/services/user.services';
import Swal from 'sweetalert2';
import { ModalSoportesCumplidoComponent } from '../../general-components/modal-soportes-cumplido/modal-soportes-cumplido.component';
import { ModalSoportesCumplidoData, Mode, RolUsuario } from 'src/app/models/modal-soporte-cumplido-data.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-listar-contratos',
  templateUrl: './listar-contratos.component.html',
  styleUrls: ['./listar-contratos.component.scss'],
})
export class ListarContratosComponent {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  documento_supervisor: string;
  contratos_supervisor: any;
  dependencias_supervisor: string = '';
  dataSource: any[] = [];
  nombreSupervisor: string = '';
  loading: boolean = true;



  constructor(
    public dialog: MatDialog,
    private cumplidosMidServices: CumplidosProveedoresMidService,
    private popUpManager: PopUpManager,
    private translate: TranslateService,
    private user: UserService,
  ) {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {});

    this.documento_supervisor = user.getPayload().documento;
  }

  ngOnInit() {
    this.cargarContratos();
    this.obtenerInfoPersona();
  }

  cargarContratos() {
  
    this.cumplidosMidServices
      .get('/supervisor/contratos-supervisor/' + this.documento_supervisor)
      .subscribe({
        next: (res: any) => {
          Swal.close();
          this.contratos_supervisor = res.Data;
          this.dependencias_supervisor =
            this.contratos_supervisor.dependencias_supervisor
              .map((dep: any) => dep.Nombre)
              .join(', ');
          if (this.contratos_supervisor.contratos == null) {
            this.popUpManager.showAlert(
              "Sin contratos",
              "No se encontraron contratos asociados a la(s) dependencia(s)."
            );
            
            this.loading = false;
          } else {
            this.dataSource = this.contratos_supervisor.contratos;
            this.dataSource = this.contratos_supervisor.contratos.map(
              (contrato: any) => {
                return {
                  Contrato: contrato,
                  numeroContrato: contrato.NumeroContratoSuscrito,
                  vigencia: contrato.Vigencia,
                  rp: contrato.NumeroRp,
                  vigenciaRp: contrato.VigenciaRp,
                  nombreProveedor: contrato.NombreProveedor,
                  dependencias: contrato.NombreDependencia,
                  acciones: [
                    {
                      icon: 'upload_2',
                      actionName: 'upload',
                      isActive: true,
                    },
                  ],
                };
              }
            );
            this.loading = false;
          }
        },
        error: (error: any) => {
          this.popUpManager.showErrorAlert(
            this.translate.instant(
              'Error al intentar cargar los contratos del supervisor.'
            )
          );
          

        }
      });
  }


  openCargaSoportes(contrato: any) {
    this.cumplidosMidServices.getContrato(contrato);
    this.dialog.open(ModalListarCumplidosComponent, {
      disableClose: true,
      height: 'auto',
      width: 'auto',
      maxWidth: '60vw',
      maxHeight: '80vh',
    });
  }

  displayedColumns: any[] = [
    {def: 'numeroContrato', header: 'NUMERO CONTRATO' },
    {def: 'vigencia', header: 'VIGENCIA' },
    {def: 'rp', header: 'RP' },
    {def: 'vigenciaRp', header: 'VIGENCIA RP' },
    {def: 'nombreProveedor', header: 'NOMBRE PROVEEDOR' },
    {def: 'dependencias', header: 'DEPENDENCIAS' },
    {
      def: 'acciones',
      header: 'ACCIONES',
      isAction: true,
    }
  ];

  async obtenerInfoPersona() {
    let info = this.user.obtenerInformacionPersona().subscribe({
      next: (response) => {
        if (response != null) {
          this.nombreSupervisor =
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

  openTest() {
    this.dialog.open(ModalSoportesCumplidoComponent, {
      disableClose: true,
      height: 'auto',
      width: 'auto',
      maxWidth: '60vw',
      maxHeight: '80vh',
      data:{
        CumplidoProveedorId:12,
        Config:{
          mode:Mode.CD,
          rolUsuario:RolUsuario.S
        }
      } as ModalSoportesCumplidoData
    });
  }

  handleActionClick(event: {action: any, element: any}) {
    if (event.action.actionName === 'upload') {
      this.openCargaSoportes(event.element);
    }
  }

}
