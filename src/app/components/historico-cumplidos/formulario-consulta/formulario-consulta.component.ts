import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Swal from 'sweetalert2';
import { Month } from 'src/app/models/month.model';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { Cumplido } from 'src/app/models/cumplido';
import { map } from 'rxjs';
import { JbpmService } from 'src/app/services/jbpm_service.service';
import { Dependencia } from 'src/app/models/dependencia';
import { Contrato } from 'src/app/models/contrato';
import { UserService } from 'src/app/services/user.services';
import { CumplidosProveedoresCrudService } from 'src/app/services/cumplidos_proveedores_crud.service';
import { EstadoCumplido } from './../../../models/revision_cumplidos_proveedores_crud/estado-cumplido.model';

@Component({
  selector: 'app-formulario-consulta',
  templateUrl: './formulario-consulta.component.html',
  styleUrls: ['./formulario-consulta.component.css'],
})
export class FormularioConsultaComponent implements OnInit {
  @Input() anios: number[] = [];
  @Input() meses: Month[] = [];
  @Output() listaCumplidos = new EventEmitter<Cumplido[]>();
  title: string = 'CONSULTA CUMPLIDOS APROBADOS';
  formularioFiltroHistorico!: FormGroup;
  ListaCumplidos: Cumplido[] = [];
  listaEstadosCumplido: EstadoCumplido[] = []
  listaDependencias!: Dependencia[] ;
  listaContratos:Contrato[]=[]
  @Input() dependencias: any[] = [];
  loading: boolean = true;

  constructor(
    private popUpManager: PopUpManager,
    private fb: FormBuilder,
    private cumplidosMidService: CumplidosProveedoresMidService,
    private jbpmService: JbpmService,
    private userService: UserService,
    private crudService: CumplidosProveedoresCrudService
  ) {
    this.formularioFiltroHistorico = this.fb.group({
      anios: [[]],
      meses: [[]],
      vigencias: [[]],
      nombres_proveedor: [[]],
      estados: [[]],
      dependencias: [[],Validators.required ],
      numeros_contrato: [[]],
    });
  }

  ngOnInit(): void {
    this.consultarDependenciasSupervisor()
    this.consultarDependenciasOrdenador()
    this.obetnerEstadosCumplido()
    this.consultarContratos()
  }

  async consultar() {
    let peticion = {
      Anios: this.formularioFiltroHistorico.get('anios')?.value,
      Meses: this.formularioFiltroHistorico.get('meses')?.value,
      Vigencias: this.formularioFiltroHistorico.get('vigencias')?.value,
      Proveedores:
        this.formularioFiltroHistorico.get('nombres_proveedor')?.value,
      Estados: this.formularioFiltroHistorico.get('estados')?.value,
      Dependencias: this.formularioFiltroHistorico.get('dependencias')?.value,
      Contratos:this.convertirStringALista(this.formularioFiltroHistorico.get('numeros_contrato')?.value) ,
    };

    this.obtenerListadoHistoricos(peticion);
  }

  async obtenerListadoHistoricos(peticion: any) {
    let dataNull = false;
    this.popUpManager.showLoadingAlert('Buscando');
    this.cumplidosMidService
      .post('/historico-cumplidos/filtro-cumplidos', peticion)
      .subscribe({
        next: (response: any) => {
          if (response.Data != null) {
            this.ListaCumplidos = response.Data.map((cumplido: Cumplido) => {
              return {
                NumeroContrato: cumplido.NumeroContrato,
                Vigencia: cumplido.Vigencia,
                Rp: cumplido.Rp,
                Mes: cumplido.Mes,
                FechaCambioEstado: cumplido.FechaCambioEstado,
                NombreProveedor: cumplido.NombreProveedor,
                Dependencia: cumplido.Dependencia,
                Estado: cumplido.Estado,
                TipoContrato: cumplido.TipoContrato,
                IdCumplido:cumplido.IdCumplido,
                acciones: [
                  { icon: 'archive',
                    actionName: 'archive',
                    isActive: true
                  },
                  {
                    icon: 'visibility',
                    actionName: 'visibility',
                    isActive: true,
                  },
                ],
              };
            });
            dataNull = false;
          } else {
            dataNull = true;
          }
          this.loading = false;
        },
        error: (error: any) => {
          Swal.close();
          this.popUpManager.showErrorAlert("Error al consultar, Intenta de nuevo");
          this.loading = false;
        },
        complete: () => {
          Swal.close();
          if (dataNull) {
            this.popUpManager.showErrorAlert("No hay resultados");
          } else if (!dataNull && !this.loading) {
            // Emitimos solo cuando loading es false y hay datos en ListaCumplidos
            this.listaCumplidos.emit(this.ListaCumplidos);
          }
        },
      });
  }

  consultarDependenciasSupervisor() {


    this.jbpmService
      .get(
        '/dependencias_supervisor/' + this.userService.getPayload().documento
      )
      .subscribe({
        next: (response: any) => {
          this.listaDependencias = response.dependencias.map(
            (dependencia: Dependencia) => {
              return {
                Codigo: dependencia.Codigo,
                Nombre: dependencia.Nombre,
              };
            }
          );
        },
      });
  }


  consultarDependenciasOrdenador() {


    this.jbpmService
      .get(
        '/dependencias_sic/' + this.userService.getPayload().documento
      )
      .subscribe({
        next: (response: any) => {
          this.listaDependencias = response.DependenciasSic.map(
            (dependencia: any) => {
              return {
                Codigo: dependencia.ESFCODIGODEP,
                Nombre: dependencia.ESFDEPENCARGADA,
              };
            }
          );
        },
      });
  }



  obetnerEstadosCumplido() {

    this.crudService.get("/estado_cumplido").subscribe({
      next: (response: any) => {
        this.listaEstadosCumplido = response.Data.map((estado: any) => {
          return {
            Id: estado.id,
            Nombre: estado.Nombre,
            CodigoAbreviacion: estado.CodigoAbreviacion,
            Descripcion: estado.Descripcion,
            Activo: estado.Activo

          } as EstadoCumplido
        })
      }
    });

    console.log( this.listaEstadosCumplido)
  }

  validacionTextos(event:any){


    const numeroContrato =this.formularioFiltroHistorico.get('numeros_contrato') ;
    numeroContrato?.setErrors(null)
    if(String(event.target.value).endsWith(",")){
      console.log("Dede",event.target.value)
      numeroContrato?.setErrors({ endComma: true });
      numeroContrato?.markAsTouched();

    }

    if(String(event.target.value).startsWith(",")){
      numeroContrato?.setErrors({ startComma: true });
      numeroContrato?.markAsTouched();
    }



  }



 async consultarContratos(){
    this.
    cumplidosMidService.get('/supervisor/contratos-supervisor/' + this.userService.getPayload().documento)
    .subscribe({
      next:(resposne:any)=>{
         this.listaContratos = resposne.Data.contratos.map((contrato:Contrato)=>{

            return {
              TipoContrato: contrato.TipoContrato,
              NumeroContratoSuscrito: contrato.NumeroContratoSuscrito,
              Vigencia: contrato.Vigencia,
              NumeroRp: contrato.NumeroRp,
              VigenciaRp: contrato.VigenciaRp,
              RPFechaRegistro: contrato.RPFechaRegistro,
              NombreProveedor: contrato.NombreProveedor,
              NombreDependencia: contrato.NombreDependencia,
              NumeroCdp: contrato.NumeroCdp,
              VigenciaCdp: contrato.VigenciaCdp,
              CDPFechaExpedicion: contrato.CDPFechaExpedicion,
              Rubro: contrato.Rubro
      }});
      }
    })
  }


  convertirStringALista(input: string): string[] {
    if (input=="") {
      console.log()
      return [];
    }

    return input.split(',').map(item => item.trim()).filter(item => item.length > 0);
  }


}

