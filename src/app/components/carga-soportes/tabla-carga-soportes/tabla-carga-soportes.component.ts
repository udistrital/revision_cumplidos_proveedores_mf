import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalCargaSoprotesComponent } from '../modal-carga-soprotes/modal-carga-soprotes.component';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { UserService } from 'src/app/services/user.services';


@Component({
  selector: 'app-tabla-carga-soportes',
  templateUrl: './tabla-carga-soportes.component.html',
  styleUrls: ['./tabla-carga-soportes.component.scss']
})
export class TablaCargaSoportesComponent {

  documento_supervisor: string;
  contratos_supervisor: any;
  dependencias_supervisor: string = '';
  dataSource: any[] = [];
  nombreSupervisor: string = '';

  constructor(
    public dialog: MatDialog,
    private cumplidosMidServices: CumplidosProveedoresMidService,
    private popUpManager: PopUpManager,
    private translate: TranslateService,
    private user: UserService
  ) {
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      });

      this.documento_supervisor = user.getPayload().documento;
  }

  ngOnInit() {

    this.cargarContratos();
  }

  cargarContratos() {
    this.cumplidosMidServices.get('/supervisor/contratos-supervisor/' + this.documento_supervisor)
      .subscribe({
        next: (res: any) => {
          this.contratos_supervisor = res.Data;
          this.nombreSupervisor = this.contratos_supervisor.nombre_supervisor;
          this.dependencias_supervisor = this.contratos_supervisor.dependencias_supervisor.map((dep: any) => dep.Nombre).join(', ');
          this.dataSource = this.contratos_supervisor.contratos;
          this.dataSource = this.contratos_supervisor.contratos.map((contrato: any) => {
            return {
              Contrato: contrato,
              numeroContrato: contrato.NumeroContratoSuscrito,
              vigencia: contrato.Vigencia,
              rp: contrato.NumeroRp,
              vigenciaRp: contrato.VigenciaRp,
              nombreProveedor: contrato.NombreProveedor,
              dependencias: contrato.NombreDependencia,
              acciones: 'Editar, Eliminar'
            };
          });
        },
        error: (error: any) => {
          this.popUpManager.showErrorAlert(this.translate.instant('Error al cargar los contratos del supervisor'));
        }
      });
  }


  openCargaSoportes(contrato:any ) {
    this.cumplidosMidServices.getContrato(contrato);
    this.dialog.open(ModalCargaSoprotesComponent,{
      disableClose: true,
      maxHeight:"80vw",
      maxWidth:"100vw",
      height: "80vh",
      width:"80%"
    });
  }

  displayedColumns: string[] = ['numeroContrato', 'vigencia', 'rp', 'vigenciaRp', 'nombreProveedor', 'dependencias', 'acciones'];


}