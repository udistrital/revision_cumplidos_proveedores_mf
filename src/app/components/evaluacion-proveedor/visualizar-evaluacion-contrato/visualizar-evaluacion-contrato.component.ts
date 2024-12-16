import { EvaluacionCumplidoProvMidService } from './../../../services/evaluacion_cumplido_prov_mid';
import { Component, signal, SimpleChanges } from '@angular/core';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { Evaluador } from 'src/app/models/evaluador.model';
import { ItemAEvaluar } from 'src/app/models/item_a_evaluar';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/services/user.services';
import { InformacionEvaluacion, Resultado } from 'src/app/models/evaluacion_cumplido_prov_mid/informacion-evaluacion.model';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
import { InformacionGeneralEvaluacion } from 'src/app/models/informacion_general_evaluacion.model';
import { Item } from 'src/app/models/evaluacion_cumplido_prov_crud/item.model';
import { EvaluacionCumplidoProvCrudService } from 'src/app/services/evaluacion_cumplido_prov_crud';
import { AsignacionEvaluador } from 'src/app/models/evaluacion_cumplido_prov_crud/asignacion_evaluador.model';
import { CambioEstadoEvaluacion } from 'src/app/models/evaluacion_cumplido_prov_crud/cambio_estado_evaluacion.model';
import { EstadoEvaluacion } from 'src/app/models/evaluacion_cumplido_prov_crud/estado_evaluacion.model';

@Component({
  selector: 'app-visualizar-evaluacion-contrato',
  templateUrl: './visualizar-evaluacion-contrato.component.html',
  styleUrls: ['./visualizar-evaluacion-contrato.component.scss']
})
export class VisualizarEvaluacionContratoComponent {

  tittle!: string;
  readonly panelOpenState = signal(false);
  listaItems!: string[];
  listaObservaciones: string[] = [];
  listaEvaluadores: Evaluador[] = [];
  resultadoEvaluacion: Resultado = {} as Resultado;
  listaItemsEvaluar: Item[] = [];
  asignacionEvaluadorId: number = 0;
  informacionEvaluacion!:InformacionEvaluacion;
  informacionGeneralEvaluacion!: InformacionGeneralEvaluacion;
  estadoEvaluacion: EstadoEvaluacion = {} as EstadoEvaluacion;
  loading: boolean = true;
  dataSource: any[] = [];

  constructor(
    private evaluacionCumplidoProvMidService: EvaluacionCumplidoProvMidService,
    private popUpManager: PopUpManager,
    private translate: TranslateService,
    private evaluacionCumplidoProvCrudService: EvaluacionCumplidoProvCrudService,
  ){
    this.asignacionEvaluadorId = 2;
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {});
  }


  async ngOnInit(){
    this.tittle = 'Ver Evaluación';
    await this.obtenerInformacionEvaluacion()
  }



  displayedColumns: any[] = [
    {def: 'Identificador', header: 'ID' },
    {def: 'Nombre', header: 'NOMBRE'},
    {def: 'FichaTecnica', header: 'DESCRIPCION' },
    {def: 'Cantidad', header: 'CANTIDAD' },
    {def: 'Unidad', header: 'UNIDAD'},
    {def: 'ValorUnitario', header: 'VALOR UNITARIO' },
    {def: 'Iva', header: 'IVA' }
  ];

  async obtenerInformacionEvaluacion(){
    await this.evaluacionCumplidoProvMidService
      .get('/informacion-evaluacion/' + this.asignacionEvaluadorId)
      .pipe(
        map((response: any) => response.Data as InformacionEvaluacion)
      )
      .subscribe({
        next: (data: InformacionEvaluacion) => {
          this.informacionEvaluacion = data;
          this.informacionGeneralEvaluacion = {
            puntajeTotalEvaluacion: this.informacionEvaluacion.PuntajeTotalEvaluacion,
            clasificacion: this.informacionEvaluacion.Clasificacion,
            dependenciaEvaluadora: this.informacionEvaluacion.DependenciaEvaluadora,
            fechaEvaluacion: new Date(this.informacionEvaluacion.FechaEvaluacion),
            nombreEvaluador: this.informacionEvaluacion.NombreEvaluador,
            cargo: this.informacionEvaluacion.Cargo,
            proveedor: this.informacionEvaluacion.EmpresaProveedor,
            objetoContrato: this.informacionEvaluacion.ObjetoContrato
          };

          this.listaItemsEvaluar = this.informacionEvaluacion.ItemsEvaluados;
          this.ObtenerEstadoEvaluacion();
          this.listaEvaluadores = this.informacionEvaluacion.Evaluadores.map((evaluador) => {
            return {
              numeroCedula: evaluador.Documento,
              cargo: evaluador.Cargo,
              itemsEvaluados: evaluador.ItemEvaluado,
              evaluacionDada: evaluador.PuntajeEvaluacion,
              porcentajeEvaluacion: evaluador.PorcentajeEvaluacion
            };
          });

          for (const evaluador of this.informacionEvaluacion.Evaluadores) {
            if (evaluador.Observaciones !== "") {
              this.listaObservaciones.push(evaluador.Observaciones);
            }
          }

          this.resultadoEvaluacion = this.informacionEvaluacion.ResultadoEvaluacion;


          this.loading = false;

        },
        error: (error: any) => {
          this.popUpManager.showErrorAlert(
            this.translate.instant(
              'Error al intentar cargar la información del evaluador'
            )
          );
        }
      });
  }

  async ObtenerEstadoEvaluacion(){
    await this.evaluacionCumplidoProvCrudService
    .get(`/asignacion_evaluador/${this.asignacionEvaluadorId}`)
    .pipe(
      map((response: any) => response.Data as AsignacionEvaluador)
    )
    .subscribe({
      next: (data: AsignacionEvaluador) => {
        console.log("Asignacion Evaluacion", data)
        this.evaluacionCumplidoProvCrudService
        .get(`/cambio_estado_evaluacion/?query=EvaluacionId.Id:${data.EvaluacionId.Id},Activo:true&sortby=FechaCreacion&order=desc&limit:1`)
        .pipe(
          map((response: any) => response.Data[0] as CambioEstadoEvaluacion)
        )
        .subscribe({
          next: (estado_evaluacion: CambioEstadoEvaluacion) => {
            this.estadoEvaluacion = estado_evaluacion.EstadoEvaluacionId;
          },
          error: (error: any) => {
            this.popUpManager.showErrorAlert(
              this.translate.instant(
                'Error al intentar cargar la información del estado de la evaluación'
              )
            );
          }
        })
      },
      error: (error: any) => {
        this.popUpManager.showErrorAlert(
          this.translate.instant(
            'Error al intentar cargar la información del evaluador'
          )
        );
      }
    })
  }

}
