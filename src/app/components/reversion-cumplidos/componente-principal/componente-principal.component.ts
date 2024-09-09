import { map } from 'rxjs';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { UserService } from 'src/app/services/user.services';
import Swal from 'sweetalert2';
import { AletManagerService } from 'src/app/managers/alert-manager.service';
import { CumplidosReversibles } from '../../../models/cumplidos_revertibles.model'


@Component({
  selector: 'app-componente-principal',
  templateUrl: './componente-principal.component.html',
  styleUrls: ['./componente-principal.component.css']
})
export class ComponentePrincipalComponent {

  documento_ordenador: string
  lista_cumplidos: CumplidosReversibles[] = [];
  displayedColumns = [
    {def:'NumeroContrato', header:'Numero Contrato' },
    {def:'Vigencia', header: 'Vigencia'},
    {def:'Rp', header: 'Rp'},
    {def:'VigenciaRp', header: 'Vigencia Rp'},
    {def:'FechaAprobacion', header: 'Fecha Aprobacion'},
    {def:'NombreProveedor', header: 'Nombre Proveedor'},
    {def:'Dependencia', header: 'Dependencia'},
    {def:'Acciones', header: 'Acciones'},
  ];

  constructor(
    private cumplidosMidServices: CumplidosProveedoresMidService,
    private popUpManager: PopUpManager,
    private translate: TranslateService,
    private user: UserService,
    private alertService:AletManagerService,
  ){

    this.documento_ordenador = user.getPayload().documento;
  }

  title:string="REVERTIR CUMPLIDOS APROBADOS"




  ngOnInit() {
    // this.obtenerCumplidosReversibles();

    this.lista_cumplidos = [
      {
        CumplidoId: 1,
        NumeroContrato: "1234",
        Vigencia: 2021,
        Rp: "1234",
        VigenciaRp: "2021",
        FechaAprobacion: new Date("2021-07-01"),
        NombreProveedor: "Proveedor 1",
        Dependencia: "Dependencia 1",
        Acciones: 'visibility,close'
      },
      {
        CumplidoId: 2,
        NumeroContrato: "1234",
        Vigencia: 2022,
        Rp: "1234",
        VigenciaRp: "2021",
        FechaAprobacion: new Date("2021-07-01"),
        NombreProveedor: "Proveedor 1",
        Dependencia: "Dependencia 1",
        Acciones: 'visibility,close'
      },
      {
        CumplidoId: 3,
        NumeroContrato: "1234",
        Vigencia: 2023,
        Rp: "1234",
        VigenciaRp: "2021",
        FechaAprobacion: new Date("2021-07-01"),
        NombreProveedor: "Proveedor 1",
        Dependencia: "Dependencia 1",
        Acciones: 'visibility,close'
      },
      {
        CumplidoId: 4,
        NumeroContrato: "1234",
        Vigencia: 2024,
        Rp: "1234",
        VigenciaRp: "2021",
        FechaAprobacion: new Date("2021-07-01"),
        NombreProveedor: "Proveedor 1",
        Dependencia: "Dependencia 1",
        Acciones: 'visibility,close'
      },
      {
        CumplidoId: 5,
        NumeroContrato: "1234",
        Vigencia: 2021,
        Rp: "1234",
        VigenciaRp: "2021",
        FechaAprobacion: new Date("2021-07-01"),
        NombreProveedor: "Proveedor 1",
        Dependencia: "Dependencia 1",
        Acciones: 'visibility,close'
      },
      {
        CumplidoId: 6,
        NumeroContrato: "1234",
        Vigencia: 2021,
        Rp: "1234",
        VigenciaRp: "2021",
        FechaAprobacion: new Date("2021-07-01"),
        NombreProveedor: "Proveedor 1",
        Dependencia: "Dependencia 1",
        Acciones: 'visibility,close'
      },
      {
        CumplidoId: 7,
        NumeroContrato: "1234",
        Vigencia: 2021,
        Rp: "1234",
        VigenciaRp: "2021",
        FechaAprobacion: new Date("2021-07-01"),
        NombreProveedor: "Proveedor 1",
        Dependencia: "Dependencia 1",
        Acciones: 'visibility,close'
      },
      {
        CumplidoId: 8,
        NumeroContrato: "1234",
        Vigencia: 2021,
        Rp: "1234",
        VigenciaRp: "2021",
        FechaAprobacion: new Date("2021-07-01"),
        NombreProveedor: "Proveedor 1",
        Dependencia: "Dependencia 1",
        Acciones: 'visibility,close'
      },
      {
        CumplidoId: 9,
        NumeroContrato: "1234",
        Vigencia: 2021,
        Rp: "1234",
        VigenciaRp: "2021",
        FechaAprobacion: new Date("2021-07-01"),
        NombreProveedor: "Proveedor 1",
        Dependencia: "Dependencia 1",
        Acciones: 'visibility,close'
      },
    ]
  }

  obtenerCumplidosReversibles(){
    this.alertService.showLoadingAlert("Cargando", "Espera mientras se cargan los cumplidos revertibles para el ordenador")
    this.cumplidosMidServices.get('/ordenador/revertir-solicitud-pago/' + this.documento_ordenador)
      .subscribe({
        next: (res: any) => {
          Swal.close()
          this.lista_cumplidos = res.Data.map((cumplido: any) => {
            return {
              CumplidoId: cumplido.CumplidoId,
              NumeroContrato: cumplido.NumeroContrato,
              Vigencia: cumplido.VigenciaContrato,
              Rp: cumplido.Rp,
              VigenciaRp: cumplido.VigenciaRP,
              FechaAprobacion: cumplido.FechaCreacion,
              NombreProveedor: cumplido.NombreProveedor,
              Dependencia: cumplido.Dependencia,
              Acciones: 'Ver, Revertir'
            };
          });
        },
        error: (err: any) => {
          Swal.close()
          this.popUpManager.showErrorAlert(this.translate.instant('Error al cargar los cumplidos revertibles para el ordenador'));
        }
      });

  }

  dataVacio(){
    return this.lista_cumplidos.length === 0;
  }


}
