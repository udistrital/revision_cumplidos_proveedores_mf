import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalCargaSoprotesComponent } from '../modal-carga-soprotes/modal-carga-soprotes.component';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { UserService } from 'src/app/services/user.services';
import Swal from 'sweetalert2';
import { AletManagerService } from 'src/app/managers/alert-manager.service';
import { AdministrativaAmazonService } from 'src/app/services/administrativa_amazon.service';
import { ModalSoportesCumplidoComponent } from '../../general-components/modal-soportes-cumplido/modal-soportes-cumplido.component';
import { ModalSoportesCumplidoData, Mode, RolUsuario } from 'src/app/models/modal-soporte-cumplido-data.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-tabla-carga-soportes',
  templateUrl: './tabla-carga-soportes.component.html',
  styleUrls: ['./tabla-carga-soportes.component.scss'],
})
export class TablaCargaSoportesComponent {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  documento_supervisor: string;
  contratos_supervisor: any;
  dependencias_supervisor: string = '';
  dataSource: any[] = [];
  nombreSupervisor: string = '';
  data!: any;



  constructor(
    public dialog: MatDialog,
    private cumplidosMidServices: CumplidosProveedoresMidService,
    private popUpManager: PopUpManager,
    private translate: TranslateService,
    private user: UserService,
    private alertService: AletManagerService,
    private administrativaAmazonService: AdministrativaAmazonService
  ) {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {});

    this.documento_supervisor = user.getPayload().documento;
  }

  ngOnInit() {



    this.cargarContratos();
    this.obtenerInfoPersona();
  }

  cargarContratos() {
    this.alertService.showLoadingAlert(
      'Cargando',
      'Espera mientras se cargan los contratos disponibles'
    );
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
            this.data = new MatTableDataSource<any>(this.dataSource);
            this.data.paginator = this.paginator;
            this.data.sort = this.sort;
            this.alertService.showInfoAlert("Sin contratos","No se encontraron contratos asociados a la(s) depenendencia(s)")
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
                  acciones: 'Editar, Eliminar',
                };
              }
            );
            this.data = new MatTableDataSource<any>(this.dataSource);
            this.data.paginator = this.paginator;
            this.data.sort = this.sort;
          }
        },
        error: (error: any) => {
          this.data = new MatTableDataSource<any>(this.dataSource);
          this.data.paginator = this.paginator;
          this.data.sort = this.sort;
          this.popUpManager.showErrorAlert(
            this.translate.instant(
              'Error al cargar los contratos del supervisor'
            )
          );

        },
      });
  }

  openCargaSoportes(contrato: any) {
    this.cumplidosMidServices.getContrato(contrato);
    this.dialog.open(ModalCargaSoprotesComponent, {
      disableClose: true,
      maxHeight: '80vw',
      maxWidth: '100vw',
      height: '80vh',
      width: '80%',
    });
  }

  displayedColumns: string[] = [
    'numeroContrato',
    'vigencia',
    'rp',
    'vigenciaRp',
    'nombreProveedor',
    'dependencias',
    'acciones',
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
      maxHeight: '80vw',
      maxWidth: '100vw',
      height: '80vh',
      width: '80vw',
      data:{
        CumplidoProveedorId:12,
        Config:{
          mode:Mode.CD,
          rolUsuario:RolUsuario.S
        }
      } as ModalSoportesCumplidoData
    });
  }
}
