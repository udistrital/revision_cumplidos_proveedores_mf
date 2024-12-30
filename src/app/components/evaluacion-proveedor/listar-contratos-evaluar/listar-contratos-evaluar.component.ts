import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AsignacionEvaluacion } from 'src/app/models/evaluacion_cumplido_prov_mid/asignaciones_evaluador.model';
import { EvaluacionCumplidoProvCrudService } from 'src/app/services/evaluacion_cumplido_prov_crud';
import { EvaluacionCumplidoProvMidService } from 'src/app/services/evaluacion_cumplido_prov_mid';
import { UserService } from 'src/app/services/user.services';
import { map } from 'rxjs/operators';
import { PopUpManager } from 'src/app/managers/popUpManager';
import Swal from 'sweetalert2';
import { AsignacionEvaluador } from 'src/app/models/evaluacion_cumplido_prov_crud/asignacion_evaluador.model';
import { Evaluacion } from 'src/app/models/evaluacion_cumplido_prov_crud/evaluacion.model';
import { ResultadoEvaluacion } from 'src/app/models/evaluacion_cumplido_prov_crud/resultado_evaluacion.model';
import { BodySolicitudEvaluacion } from 'src/app/models/evaluacion_cumplido_prov_crud/solicitud_evaluacion.model';
import { CambioEstadoEvaluacion } from 'src/app/models/evaluacion_cumplido_prov_crud/cambio_estado_evaluacion.model';
import { CumplidosProveedoresMidService } from './../../../services/cumplidos_proveedores_mid.service';
import { UtilsService } from 'src/app/services/utils.service';
import { EvaluacionCumplidosProveedoresMidService } from 'src/app/services/evaluacion_cumplidos_provedores_mid.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-listar-contratos-evaluar',
  templateUrl: './listar-contratos-evaluar.component.html',
  styleUrls: ['./listar-contratos-evaluar.component.scss']
})
export class ListarContratosEvaluarComponent {

  tittle!: string;
  filtrosForm!: FormGroup;
  //vigencias!: number[];
  documento_evaluador!: string;
  dataSource: any[] = [];
  loading: boolean = true;
  asignacionEvaluador!: AsignacionEvaluador;
  evaluacion!: Evaluacion;
  mensajeDeConfirmacion: string = '';
  documentoSupervisor: string = this.user.getPayload().documento;


  displayedColumns: any[] = [
    {def: 'nombreProveedor', header: 'NOMBRE' },
    {def: 'dependencia', header: 'DEPENDENCIA' },
    {def: 'tipoContrato', header: 'TIPO DE CONTRATO' },
    {def: 'contrato', header: 'CONTRATO' },
    {def: 'vigencia', header: 'VIGENCIA' },
    {
      def: 'acciones',
      header: 'ACCIONES',
      isAction: true,
    }
  ];


  constructor(
    private fb: FormBuilder,
    private evaluacionCumplidoProvMidService: EvaluacionCumplidoProvMidService,
    private evaluacionCumplidoProvCrudService: EvaluacionCumplidoProvCrudService,
    private user: UserService,
    private popUpManager: PopUpManager,
    private evaluacionCumplidosMid: EvaluacionCumplidosProveedoresMidService,
    private evaluacionCumplidosCrud: EvaluacionCumplidoProvCrudService,
    private activateRoute: ActivatedRoute,
    private router: Router
  ){
    this.documento_evaluador = user.getPayload().documento;

    this.filtrosForm = this.fb.group({
      nombreProveedor: ['', [Validators.minLength(5)]],
      numeroContrato: ['', [Validators.pattern(/^[0-9]+$/)]],
      vigencia: ['', [Validators.pattern(/^[0-9]+$/)]],
    });
  }

  async ngOnInit(){
    this.tittle = "Lista Proveedores";
    this.obtenerAsignacionesEvaluador();
    //this.vigencias = this.obtenerListaVigencias();

    //Verificar y mostrar el mensaje de confirmacion despues de realizar una evaluacion
    this.activateRoute.queryParams.subscribe((params) => {
      this.mensajeDeConfirmacion = params['mensajeDeConfirmacion'];
    });

    this.documentoSupervisor = this.user.getPayload().documento;
    console.log("documentoSupervisor", this.documentoSupervisor); 
  }

  obtenerAsignacionesEvaluador(){
    this.popUpManager.showLoadingAlert(
      'Cargando',
      'Por favor, espera mientras se cargan las asignaciones del evaluador.'
    );
    this.evaluacionCumplidoProvMidService
    .get(`/asignaciones/consultar/${this.documento_evaluador}`)
    .pipe(
      map((response:any) => response.Data as AsignacionEvaluacion)
    )
    .subscribe({
      next: (data:AsignacionEvaluacion) => {
        Swal.close()
        if (data.Asignaciones === null && data.SinAsignaciones === null) {
          this.popUpManager.showAlert(
            'Sin asignaciones para el evaluador',
            `No se encontraron asignaciones para el evaluador con cédula número ${this.documento_evaluador}.`
          );
        }
        if (data.Asignaciones && data.Asignaciones.length > 0) {
          data.Asignaciones.forEach((asignacion) => {
            //if (asignacion.EstadoAsignacionEvaluador && asignacion.EstadoAsignacionEvaluador.Id === 1 &&  asignacion.EstadoEvaluacion &&  asignacion.EstadoEvaluacion?.CodigoAbreviacion !== 'GNT' && asignacion.RolEvaluador === 'SP'){}
            this.dataSource.push({
              asignacionEvaluadorId: asignacion.AsignacionEvaluacionId,
              nombreProveedor: asignacion.NombreProveedor,
              dependencia: asignacion.Dependencia,
              tipoContrato: asignacion.TipoContrato,
              contrato: asignacion.NumeroContrato,
              vigencia: asignacion.VigenciaContrato,
              EvaluacionId: asignacion.EvaluacionId,
              EstadoEvaluacion: asignacion.EstadoEvaluacion,
              acciones: [
                {
                  icon: 'edit',
                  actionName: 'edit',
                  isActive: asignacion.EstadoAsignacionEvaluador && asignacion.EstadoAsignacionEvaluador.Id === 1 &&  asignacion.EstadoEvaluacion &&  asignacion.EstadoEvaluacion?.CodigoAbreviacion !== 'GNT'? true : false,
                },
                {
                  icon: 'visibility',
                  actionName: 'visibility',
                  isActive: asignacion.EstadoEvaluacion && asignacion.EstadoEvaluacion.CodigoAbreviacion !== 'GNT' ? true: false,
                },
                {
                  icon: 'accessibility',
                  actionName: 'accessibility',
                  isActive: asignacion.EstadoEvaluacion?.CodigoAbreviacion === 'GNT' && asignacion.RolEvaluador === 'SP' ? true : false,
                },
              ]
            })
          });
        }

        if (data.SinAsignaciones && data.SinAsignaciones.length > 0) {
          data.SinAsignaciones.forEach((asignacion) => {
            this.dataSource.push({
              asignacionEvaluadorId: asignacion.AsignacionEvaluacionId,
              nombreProveedor: asignacion.NombreProveedor,
              dependencia: asignacion.Dependencia,
              tipoContrato: asignacion.TipoContrato,
              contrato: asignacion.NumeroContrato,
              vigencia: asignacion.VigenciaContrato,
              EvaluacionId: asignacion.EvaluacionId,
              EstadoEvaluacion: asignacion.EstadoEvaluacion,
              acciones: [
                {
                  icon: 'edit',
                  actionName: 'edit',
                  isActive: false,
                },
                {
                  icon: 'visibility',
                  actionName: 'visibility',
                  isActive: false,
                },
                {
                  icon: 'accessibility',
                  actionName: 'accessibility',
                  isActive: true
                },
              ]
            })
          });
        }
        this.loading = false;
      },
      error: (error: any) => {
        Swal.close()
        this.popUpManager.showErrorAlert(
          'Error al intentar cargar las asignaciones del evaluador.'
        );
        this.loading = false;
      }
    })
  }

  obtenerListaVigencias() {
    const anioActual = new Date().getFullYear(); // Obtiene el año actual
    const anios = [];

    for (let i = 2017; i <= anioActual; i++) {
      anios.push(i);
    }
    return anios;
  }

  async realizarEvaluacion(asignacionEvaluadorId: number){
    await this.evaluacionCumplidoProvCrudService.setAsignacionEvaluadorWithId(asignacionEvaluadorId);
    await this.evaluacionCumplidoProvCrudService.asignacionEvaluador$.subscribe((asignacion) => {
      if (asignacion){
        this.asignacionEvaluador = asignacion;
        this.evaluacionCumplidoProvCrudService.setEvaluacionWithId(asignacion.EvaluacionId.Id);
        this.evaluacion = asignacion.EvaluacionId;
      }
    })
    await this.evaluacionCumplidoProvCrudService
    .get(`/resultado_evaluacion/?query=AsignacionEvaluadorId.Id:${asignacionEvaluadorId}`)
    .pipe(
      map((response:any) => response.Data as ResultadoEvaluacion[])
    )
    .subscribe({
      next: async (data:ResultadoEvaluacion[]) => {
        if (data[0].Id === undefined) {
          this.evaluacionCumplidoProvCrudService
          .get(`/cambio_estado_evaluacion/?query=EvaluacionId.Id:${this.evaluacion.Id},Activo:true&sortby=FechaCreacion&order=desc`)
          .pipe(
            map((response:any) => response.Data as CambioEstadoEvaluacion[])
          )
          .subscribe({
            next: (data: CambioEstadoEvaluacion[]) => {
              if (data[0].EstadoEvaluacionId.CodigoAbreviacion === 'EPR'){
                this.router.navigate(['/evaluacion-contrato']);
              } else if (data[0].EstadoEvaluacionId.CodigoAbreviacion === 'GNT'){
                this.popUpManager.showAlert('Gestión en proceso', 'El supervisor todavia se encuentra gestionando esta evaluación, es necesario esperar a que termine para que puedas evaluar.');
              } else if (data[0].EstadoEvaluacionId.CodigoAbreviacion === 'PRE'){
                this.popUpManager.showAlert('Evaluación Realizada','La evaluación ya fue realizada por todos los evaluadores, debes dirigirte a la sección de visualizar evaluación y firmarla si estas de acuerdo.');
              } else {
                this.popUpManager.showAlert('Evaluación Finalizada', 'La evaluación fue aprobada y firmada por todos los evaluadores. Ya no es posible evaluar.')
              }
            }
          })


        } else {
          let confirm = await this.popUpManager.showConfirmAlert(
            'La evaluación ya fue realizada, ¿desea visualizarla?'
          );
          if (confirm.isConfirmed) {
            this.router.navigate(['/visualizar-evaluacion-contrato']);
          }
        }
      },
      error: (error: any) => {
        this.popUpManager.showErrorAlert(
          'Error al intentar cargar la evaluación del contrato.'
        );
      }
    })
  }

  async visualizarEvaluacion(asignacionEvaluadorId: number){
    await this.evaluacionCumplidoProvCrudService.setAsignacionEvaluadorWithId(asignacionEvaluadorId);
    await this.evaluacionCumplidoProvCrudService.asignacionEvaluador$.subscribe((asignacion) => {
      if (asignacion){
        this.asignacionEvaluador = asignacion;
        this.evaluacion = asignacion.EvaluacionId;
      }
    })
    this.evaluacionCumplidoProvCrudService
    .get(`/resultado_evaluacion/?query=AsignacionEvaluadorId.Id:${asignacionEvaluadorId}`)
    .pipe(
      map((response:any) => response.Data as ResultadoEvaluacion[])
    )
    .subscribe({
      next: async (resultado:ResultadoEvaluacion[]) => {
        if (resultado[0].Id === undefined) {
          let confirm = await this.popUpManager.showConfirmAlert(
            'La evaluación no ha sido realizada, ¿desea realizarla?'
          );
          if (confirm.isConfirmed){
            this.router.navigate(['/evaluacion-contrato']);
          }
        } else {
          this.router.navigate(['/visualizar-evaluacion-contrato']);
        }
      }
    })

  }


    async gestionarEvaluacion(asignacionEvaluador: any){
      if (asignacionEvaluador.EvaluacionId === 0) {
        await this.evaluacionCumplidoProvCrudService
        .get(`/evaluacion/?query=ContratoSuscritoId:${asignacionEvaluador.contrato},VigenciaContrato:${asignacionEvaluador.vigencia},Activo:true&sortby=FechaCreacion&order=desc&limit=-1`)
        .pipe(
          map((res: any) => res.Data as Evaluacion[])
        )
        .subscribe({
          next: async (data: Evaluacion[]) => {
            if (data[0].Id === undefined){
              let confirm = await this.popUpManager.showConfirmAlert('No hay una evaluación creada para este contrato, ¿Desea crear una nueva?');
              if (confirm.isConfirmed){
                let bodySolicitudEvaluacion: BodySolicitudEvaluacion;
                bodySolicitudEvaluacion = {
                  ContratoSuscritoId: Number(asignacionEvaluador.contrato),
                  VigenciaContrato: Number(asignacionEvaluador.vigencia)
                }
                await this.evaluacionCumplidoProvCrudService
                .post(`/crear_solicitud_evaluacion`, bodySolicitudEvaluacion)
                .pipe(
                  map((response:any) => response.Data as Evaluacion)
                )
                .subscribe({
                  next: async (data:Evaluacion) => {
                    await this.evaluacionCumplidoProvCrudService.setEvaluacion(data);
                    this.router.navigate(['/gestion-evaluadores']);
                  },
                  error: (error: any) => {
                    this.popUpManager.showErrorAlert(
                      'Error al intentar crear la solicitud de evaluación.'
                    );
                  }
                })
              }
            } else {
              await this.evaluacionCumplidoProvCrudService.setEvaluacion(data[0]);
              this.router.navigate(['/gestion-evaluadores']);
            }
          }
        }) 
      } else {
        await this.evaluacionCumplidoProvCrudService.setEvaluacionWithId(asignacionEvaluador.EvaluacionId);
        await this.evaluacionCumplidoProvCrudService.setAsignacionEvaluador(asignacionEvaluador.AsignacionEvaluacionId);
        await this.evaluacionCumplidoProvCrudService.evaluacion$.subscribe((evaluacion) => {
          if (evaluacion) {
            this.evaluacion = evaluacion;
          }
        })
        await this.evaluacionCumplidoProvCrudService.asignacionEvaluador$.subscribe((asignacion) => {
          if (asignacion) {
            this.asignacionEvaluador = asignacion;
          }
        })

        if (asignacionEvaluador.EstadoEvaluacion.CodigoAbreviacion === 'EPR'){
          this.popUpManager.showAlert('Evaluacion en proceso', 'Los evaluadores se encuentran realizando sus evaluaciones, ya no es posible gestionar la evaluación');
        } else if (asignacionEvaluador.EstadoEvaluacion.CodigoAbreviacion === 'GNT'){
          this.router.navigate(['/gestion-evaluadores']);
        } else if (asignacionEvaluador.EstadoEvaluacion.CodigoAbreviacion === 'PRE'){
          this.popUpManager.showAlert('Evaluación Realizada','La evaluación ya fue realizada por todos los evaluadores, ya no es posible gestionar la evaluación.');
        } else {
          this.popUpManager.showAlert('Evaluación Finalizada', 'La evaluación fue aprobada y firmada por todos los evaluadores. Ya no es posible gestionar la evaluación.')
        }
      }
    }


  handleActionClick(event: {action: any, element: any}) {
    if (event.action.actionName === 'edit') {
      this.realizarEvaluacion(event.element.asignacionEvaluadorId);
    } else if (event.action.actionName === 'visibility') {
      this.visualizarEvaluacion(event.element.asignacionEvaluadorId);
    } else if (event.action.actionName === 'accessibility'){
      this.gestionarEvaluacion(event.element);
    }
  /*
      await this.evaluacionCumplidosCrud.setEvaluacion(evaluacion);
      this.router.navigate([vista]);
      resolve();
    });
    */
  }


}

  // obtenerListaVigencias() {
  //   const anioActual = new Date().getFullYear();  // Obtiene el año actual
  //   const anios = [];

  //   for (let i = 2017; i <= anioActual; i++) {
  //       anios.push(i);
  //   }
  //   return anios;
  // }

