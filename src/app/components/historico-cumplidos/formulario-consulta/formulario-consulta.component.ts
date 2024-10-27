import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Swal from 'sweetalert2';
import { Month } from 'src/app/models/month.model';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { Cumplido } from 'src/app/models/cumplido';
import { map } from 'rxjs';
import { JbpmService } from 'src/app/services/jbpm_service.service';
import { Dependencia } from 'src/app/models/dependencia';
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
      dependencias: [[]],
      numeros_contrato: [[]],
    });
  }

  ngOnInit(): void {
    this.consultarDependenciasSupervisor()
    this.consultarDependenciasOrdenador()
    this.obetnerEstadosCumplido()
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
      Contratos: this.formularioFiltroHistorico.get('numeros_contrato')?.value,
    };

    this.obtenerListadoHistoricos(peticion);
  }

  async obtenerListadoHistoricos(peticion: any) {
    this.popUpManager.showLoadingAlert('Buscando');
    this.cumplidosMidService
      .post('/historico-cumplidos/filtro-cumplidos', peticion)
      .subscribe({
        next: (response: any) => {
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
              acciones: [
                { icon: 'archive', actionName: 'archive', isActive: true },
                {
                  icon: 'visibility',
                  actionName: 'visibility',
                  isActive: true,
                },
              ],
            };
          });
        },
        error: (error: any) => {
          console.error('Error');
          Swal.close();
        },
        complete: () => {
          this.listaCumplidos.emit(this.ListaCumplidos);
          Swal.close();
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

}

