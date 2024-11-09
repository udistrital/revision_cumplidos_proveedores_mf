import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { JbpmServicePost } from 'src/app/services/jbpm_post_service.service';
import { UtilsService } from 'src/app/services/utils.service';

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
  listaEstadosCumplido: EstadoCumplido[] = [];
  listaDependencias!: Dependencia[];
  listaProveedores: Contrato[] = [];
  dependencias: any[] = [];
  loading: boolean = true;
  desactivarContratos: boolean = false;
  listaVigencias: any[] = [];
  listaNumerosContratos: any[] = [];
  listaContratos: any[] = [];

  constructor(
    private popUpManager: PopUpManager,
    private fb: FormBuilder,
    private cumplidosMidService: CumplidosProveedoresMidService,
    private jbpmService: JbpmService,
    private userService: UserService,
    private crudService: CumplidosProveedoresCrudService,
    private jbpmPostService: JbpmServicePost,
    private utilsService:UtilsService,
    private cdRef: ChangeDetectorRef
  ) {
    this.formularioFiltroHistorico = this.fb.group({
      anios: [[]],
      meses: [[]],
      vigencias: [{ value: [], disabled: true }],
      nombres_proveedor: [{ value: [], disabled: true }],
      estados: [[]],
      dependencias: [[], Validators.required],
      numeros_contrato: [{ value: [], disabled: true }],
    });
    this.listaDependencias = [];
  }

  async ngOnInit(): Promise<void> {
    await this.consultarDependencias();
    await this.obetnerEstadosCumplido();
    this.anios = this.utilsService.obternerAnios();
    this.meses = this.utilsService.obtenerMeses();
  }

  async consultar() {
    let peticion = {
      Anios: this.formularioFiltroHistorico.get('anios')?.value.map((val: string | number) => Number(val)) || [],
      Meses: this.formularioFiltroHistorico.get('meses')?.value.map((val: string | number) => Number(val)) || [],
      Vigencias: this.formularioFiltroHistorico.get('vigencias')?.value.map((val: string | number) => Number(val)) || [],
      Proveedores: this.formularioFiltroHistorico.get('nombres_proveedor')?.value,
      Estados: this.formularioFiltroHistorico.get('estados')?.value,
      Dependencias: this.formularioFiltroHistorico.get('dependencias')?.value,
      Contratos: this.formularioFiltroHistorico.get('numeros_contrato')?.value,
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
                Periodo: cumplido.InformacionPago,
                NombreProveedor: cumplido.NombreProveedor,
                Dependencia: cumplido.Dependencia,
                Estado: cumplido.Estado,
                TipoContrato: cumplido.TipoContrato,
                IdCumplido: cumplido.IdCumplido,
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
          } else {
            dataNull = true;
          }
        },
        error: (error: any) => {
          Swal.close();;
          this.popUpManager.showErrorAlert(
            'Error al consultar, Intenta de nuevo'
          );;
          this.loading = false;
        },
        complete: () => {
          if (dataNull) {
            Swal.close();
            this.popUpManager.showErrorAlert('No hay resultados');
            return;
          }
          Swal.close();
          this.listaCumplidos.emit(this.ListaCumplidos);
        },
      });
  }

  async consultarDependenciasSupervisor(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.jbpmService
        .get(
          '/dependencias_supervisor/' + this.userService.getPayload().documento
        )
        .subscribe({
          next: (response: any) => {
  
            let consulta = response.dependencias.dependencia.map(
              (dependencia: any) => {
                return {
                  Codigo: dependencia.codigo,
                  Nombre: dependencia.nombre,
                };
              }
            );
            if (consulta.length > 0) {
              this.listaDependencias = this.listaDependencias.concat(consulta);
            }
            resolve();
          },
        });
    });
  }

  private async consultarDependencias() {
    await this.consultarDependenciasOrdenador();
    await this.consultarDependenciasSupervisor();
  }

  async consultarDependenciasOrdenador(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.jbpmService
        .get('/dependencias_sic/' + this.userService.getPayload().documento)
        .subscribe({
          next: (response: any) => {
            let consulta = response.DependenciasSic.Dependencia.map(
              (dependencia: any) => {
                return {
                  Codigo: dependencia.ESFCODIGODEP,
                  Nombre: dependencia.ESFDEPENCARGADA,
                };
              }
            );
            if (consulta.length > 0) {
              this.listaDependencias = this.listaDependencias.concat(consulta);
            }
            resolve();
          },
        });
    });
  }

  async obetnerEstadosCumplido(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.crudService.get('/estado_cumplido').subscribe({
        next: (response: any) => {
          this.listaEstadosCumplido = response.Data.map((estado: any) => {
            return {
              Id: estado.id,
              Nombre: estado.Nombre,
              CodigoAbreviacion: estado.CodigoAbreviacion,
              Descripcion: estado.Descripcion,
              Activo: estado.Activo,
            } as EstadoCumplido;
          });
          resolve();
        },
      });

    });
  }

  validacionTextos(event: any) {
    const numeroContrato =
      this.formularioFiltroHistorico.get('numeros_contrato');
    numeroContrato?.setErrors(null);
    if (String(event.target.value).endsWith(',')) {
      numeroContrato?.setErrors({ endComma: true });
      numeroContrato?.markAsTouched();
    }

    if (String(event.target.value).startsWith(',')) {
      numeroContrato?.setErrors({ startComma: true });
      numeroContrato?.markAsTouched();
    }
  }

  convertirStringALista(input: string): string[] {
    if (input == '') {
      return [];
    }

    return input
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  async dependenciaChange(envent: string[]) {
    
    if (envent.length > 0) {
      this.formularioFiltroHistorico.get('nombres_proveedor')?.enable();
      this.formularioFiltroHistorico.get('numeros_contrato')?.enable();
      this.formularioFiltroHistorico.get('vigencias')?.enable();

      let body = {
        dependencias: envent.map((dependencia) => `'${dependencia}'`).join(','),
      };
   console.log(body)
      await this.consultarProveedores(body);

      await this.consultarVigenciasYContratos(body);
    } else {
      this.listaContratos = [];
      this.listaVigencias = [];
      this.formularioFiltroHistorico.get('nombres_proveedor')?.disable();
      this.formularioFiltroHistorico.get('numeros_contrato')?.disable();
      this.formularioFiltroHistorico.get('vigencias')?.disable();

      this.listaProveedores = [];
    }
  }

  async consultarProveedores(body: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.jbpmPostService.post('/proveedores_dependencias', body).subscribe({
        next: (response: any) => {
          if(response.dependencias.proveedor && response.dependencias.proveedor.length>0){
            this.listaProveedores = response.dependencias.proveedor.map(
              (dependencia: any) => {
                return {
                  ProveedorId: dependencia.proveedor_id,
                  NombreProveedor: dependencia.nombre_proveedor,
                };
              }
            );
            resolve();
          }else{ this.listaNumerosContratos=[]
            resolve();
          }
        },
      });
    });
  }
  async consultarVigenciasYContratos(body: any): Promise<void> {
    this.listaNumerosContratos=[]
    return new Promise((resolve, reject) => {
      this.jbpmPostService
        .post('/contratos_dependencias_total/', body)
        .subscribe({
          next: (response: any) => {
           if(response.dependencias.contratos && response.dependencias.contratos.length>0){
            this.listaContratos = response.dependencias.contratos.map(
              (contratoItem: any) => {
                return {
                  vigencia: contratoItem.vigencia,
                  contrato: contratoItem.numero_contrato_suscrito,
                };
              }
            );
            this.listaContratos.forEach((contrato) => {
              if (!this.listaNumerosContratos.includes(contrato.contrato)) {
                this.listaNumerosContratos.push(contrato.contrato);
              }
            });
            resolve();
           }else{
            this.listaNumerosContratos=[]
            resolve();
           }
          },
        });
    });
  }

  contratoChange(elemt: any) {

    elemt.forEach((vigencia2:any)=>{
      this.listaContratos.forEach((vigencia) => {
       

        if (vigencia.contrato === vigencia2) {
          if (!this.listaVigencias.includes(vigencia.vigencia)) {
            this.listaVigencias.push(vigencia.vigencia);
          }
        }
      });

    })
   
  }
}
