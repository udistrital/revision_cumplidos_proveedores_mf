import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { CumplidosProveedoresMidService } from './../../../services/cumplidos_proveedores_mid.service';
import { UtilsService } from 'src/app/services/utils.service';
import { UserService } from 'src/app/services/user.services';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { EvaluacionCumplidosProveedoresMidService } from 'src/app/services/evaluacion_cumplidos_provedores_mid.service';
import { Router } from '@angular/router';
import { Evaluacion } from 'src/app/models/evaluacion_cumplidos_proiveedores_crud/evaluacion';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { EvaluacionCumplidoProvCrudService } from 'src/app/services/evaluacion_cumplido_prov_crud';


@Component({
  selector: 'app-listar-contratos-evaluar',
  templateUrl: './listar-contratos-evaluar.component.html',
  styleUrls: ['./listar-contratos-evaluar.component.scss'],
})
export class ListarContratosEvaluarComponent {
  tittle!: string;
  filtrosForm!: FormGroup;
  vigencias!: number[];
  dataSource: any[] = [];

  displayedColumns: any[] = [
    { def: 'nombreProveedor', header: 'NOMBRE' },
    { def: 'dependencia', header: 'DEPENDENCIA' },
    { def: 'tipoContrato', header: 'TIPO DE CONTRATO' },
    { def: 'contrato', header: 'CONTRATO' },
    { def: 'vigencia', header: 'VIGENCIA' },
    {
      def: 'acciones',
      header: 'ACCIONES',
      isAction: true,
    },
  ];

  constructor(
    private fb: FormBuilder,
    private cumplidosProveedoresMidService: CumplidosProveedoresMidService,
    private userService: UserService,
    private popUpManager: PopUpManager,
    private evaluacionCumplidosMid: EvaluacionCumplidosProveedoresMidService,
    private evaluacionCumplidosCrud: EvaluacionCumplidoProvCrudService,
    private router: Router
  ) {
    this.filtrosForm = this.fb.group({
      nombreProveedor: ['', [Validators.minLength(5)]],
      numeroContrato: ['', [Validators.pattern(/^[0-9]+$/)]],
      vigencia: ['', [Validators.pattern(/^[0-9]+$/)]],
    });
  }
  documentoSupervisor: string = this.userService.getPayload().documento;
 async ngOnInit(){
    this.tittle = "Lista Proveedores";
   this.obtenerListaVigencias();

    await this.consulsarAsignaciones()
    
    this.documentoSupervisor = this.userService.getPayload().documento;
  }

  obtenerListaVigencias() {
    const anioActual = new Date().getFullYear(); // Obtiene el año actual
    const anios = [];

    for (let i = 2017; i <= anioActual; i++) {
      anios.push(i);
    }
    return anios;
  }




  consulsarAsignaciones(): Promise<void> {
    this.popUpManager.showLoadingAlert("Por favor, espere", "Consultando asignaciones");
    return new Promise((resolve, reject) => {
      this.evaluacionCumplidosMid
        .get('/consultar-asignaciones/' + this.documentoSupervisor)
        .subscribe({
          next: (res: any) => {
            if (res.Data && res.Data.Asignaciones.length > 0) {
              var asignaciones = res.Data.Asignaciones.map((item: any) => {
                return {
                  nombreProveedor: item.NombreProveedor,
                  dependencia: item.Dependencia,
                  tipoContrato: item.TipoContrato,
                  contrato: item.NumeroContrato,
                  vigencia: item.VigenciaContrato,
                  acciones: [
                    {
                      icon: 'edit',
                      actionName: 'realizarEv',
                      isActive: true,
                    },
                    {
                      icon: 'visibility',
                      actionName: 'visibility',
                      isActive: true,
                    },
                    {
                      icon: 'accessibility',
                      actionName: 'gestionarEv',
                      isActive: true,
                    },
                  ],
                };
              });
              this.dataSource = [...this.dataSource, ...asignaciones];
            }
            if (res.Data && res.Data.SinAsignaciones.length > 0) {
              var asignaciones  = res.Data.SinAsignaciones.map((item: any) => {
                return {
                  nombreProveedor: item.NombreProveedor,
                  dependencia: item.Dependencia,
                  tipoContrato: item.TipoContrato,
                  contrato: item.NumeroContrato,
                  vigencia: item.VigenciaContrato,
                  acciones: [
                    {
                      icon: 'accessibility',
                      actionName: 'crearEv',
                      isActive: true,
                      
                    },
                  ],
                };
              });
              this.dataSource = [...this.dataSource, ...asignaciones];
            }
          },complete:()=>{
            Swal.close();
          }
          ,
        });
    });
  }

  handleActionClick(event: { action: any; element: any }) {
    
    if (event.action.actionName === 'gestionarEv') {
        
      const  asignacion={
        ContratoSuscritoId: event.element.contrato,
        VigenciaContrato: event.element.vigencia,
      }
      this.gestionarEvaluacion(asignacion);
      
    } else if (event.action.actionName === 'crearEv') {
      this.crearEvaluacion(event.element);
    }
    else if (event.action.actionName === 'visibility') {
      this.verEvaluacion(event.element);
    }
    else if (event.action.actionName === 'realizarEv') {
      this.realizarEvaluacion(event.element);
    }
  }



  async realizarEvaluacion(element:any) : Promise<void>{
  return await this.redirigirVista(element, 'evaluacion-contrato')
  }

  async verEvaluacion(element:any) : Promise<void>{
  return await this.redirigirVista(element, 'visualizar-evaluacion-contrato');
  }


  async gestionarEvaluacion(element: any): Promise<void> {
    return await this.redirigirVista(element, 'gestion-evaluadores');
  }



async  redirigirVista(element: any, vista: string): Promise<void> {
  console.log("Elementiiiii:", element);
    return new Promise( async (resolve) => {

      const evaluacion =  await this.consultarEvaluacionCreada(element.ContratoSuscritoId, element.VigenciaContrato);
      await this.evaluacionCumplidosCrud.setEvaluacion(evaluacion); 
      console.log("Evaluacion:", evaluacion);
       this.router.navigate([vista]);
       resolve();
     });

  }

  async crearEvaluacion(element: any) {
    const solicitudCrearEvaluacion = {
      ContratoSuscritoId: Number(element.contrato),
      VigenciaContrato: Number(element.vigencia),
    };

    var evaluacion=  await this.consultarEvaluacionCreada(element.contrato, element.vigencia);


    if(evaluacion && evaluacion!=null){
      this.evaluacionCumplidosCrud.setEvaluacion(evaluacion); 
      this.redirigirVista(evaluacion, 'gestion-evaluadores');
      return Promise.resolve(evaluacion)
     
    }else{
      return new Promise((resolve, reject) => {
        this.evaluacionCumplidosCrud
          .post('/evaluacion', solicitudCrearEvaluacion)
          .subscribe({
            next: (res: any) => {
              console.log("Evaluacion data:", res.Data);
              this.evaluacionCumplidosCrud.setEvaluacion(res.Data); 
              debugger
              console.log("imprimir :", res.Data);
              const evaluacion = res.Data;

              this.redirigirVista(evaluacion, 'gestion-evaluadores');
              resolve(res.Data)
            },
            complete: () => {
              this.popUpManager.showSuccessAlert(
                'Evaluación creada correctamente'
              );
            },
            error: (error: any) => {
              this.popUpManager.showErrorAlert('Error al crear la evaluación');
            },
          });
      });
    }
  }

  async consultarEvaluacionCreada(
    contratoId: number,
    vigenciaContrato: number
  ): Promise<Evaluacion | null> {
    return new Promise((resolve, reject) => {
      this.evaluacionCumplidosCrud
        .get(
          `/evaluacion/?query=ContratoSuscritoId:${contratoId},VigenciaContrato:${vigenciaContrato}&limit=1`
        )
        .subscribe({
          next: (res: any) => {
            if (res.Data && res.Data.length > 0) {
              const evaluacion: Evaluacion = res.Data[0];
              resolve(evaluacion);
            } else {
              resolve(null);
            }
          },
          error: (error: any) => {
            this.popUpManager.showErrorAlert(
              'Error al consultar la evaluación'
            );
          },
        });
    });
  }
}
