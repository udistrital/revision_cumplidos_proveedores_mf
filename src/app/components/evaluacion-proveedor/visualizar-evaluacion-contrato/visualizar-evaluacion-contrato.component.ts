import { EvaluacionCumplidoProvMidService } from './../../../services/evaluacion_cumplido_prov_mid';
import { Component, signal, SimpleChanges } from '@angular/core';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { Evaluador } from 'src/app/models/evaluador.model';
import { ItemAEvaluar } from 'src/app/models/item_a_evaluar';
import { Evaluacion } from 'src/app/models/evaluacion_cumplidos_proiveedores_crud/evaluacion';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/services/user.services';
import {
  InformacionEvaluacion,
  Resultado,
} from 'src/app/models/evaluacion_cumplido_prov_mid/informacion-evaluacion.model';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
import { InformacionGeneralEvaluacion } from 'src/app/models/informacion_general_evaluacion.model';
import { Item } from 'src/app/models/evaluacion_cumplido_prov_crud/item.model';
import { EvaluacionCumplidoProvCrudService } from 'src/app/services/evaluacion_cumplido_prov_crud';
import { AsignacionEvaluador } from 'src/app/models/evaluacion_cumplido_prov_crud/asignacion_evaluador.model';
import { CambioEstadoEvaluacion } from 'src/app/models/evaluacion_cumplido_prov_crud/cambio_estado_evaluacion.model';
import { EstadoEvaluacion } from 'src/app/models/evaluacion_cumplido_prov_crud/estado_evaluacion.model';
import { DocumentosCrudService } from './../../../services/documentos_crud.service';
import { GestorDocumentalService } from 'src/app/services/gestor_documental.service';
import { GestorDocumental } from './../../../models/gestor_documnental/gestor_ducumental';
import { ModalVisualizarSoporteComponent } from 'src/app/components/general-components/modal-visualizar-soporte/modal-visualizar-soporte.component';
import { MatDialog } from '@angular/material/dialog';
import { FirmaElectronicaService } from 'src/app/services/firma_electronica_mid.service';
import { PeticionFirmaElectronicaEvaluacion } from './../../../models/evaluacion_cumplido_prov_mid/peticion_firma_electronica_evaluacion';
import { Button } from 'src/app/models/button.model';
import { RespuestaFirmaElectronica } from 'src/app/models/evaluacion_cumplido_prov_mid/respuesta_firma_electronica';

@Component({
  selector: 'app-visualizar-evaluacion-contrato',
  templateUrl: './visualizar-evaluacion-contrato.component.html',
  styleUrls: ['./visualizar-evaluacion-contrato.component.scss'],
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
  informacionEvaluacion!: InformacionEvaluacion;
  informacionGeneralEvaluacion!: InformacionGeneralEvaluacion;
  estadoEvaluacion: EstadoEvaluacion = {} as EstadoEvaluacion;
  loading: boolean = true;
  dataSource: any[] = [];
  evaluacion!: Evaluacion | null;
  documentoEvalucion!: GestorDocumental;
  constructor(
    private evaluacionCumplidoProvMidService: EvaluacionCumplidoProvMidService,
    private popUpManager: PopUpManager,
    private translate: TranslateService,
    private evaluacionCumplidoProvCrudService: EvaluacionCumplidoProvCrudService,
    private documentosCrudService: DocumentosCrudService,
    private gestotrDocumental: GestorDocumentalService,
    private dialog: MatDialog,
    private firmaElectronicaService: FirmaElectronicaService
  ) {
    this.asignacionEvaluadorId = 41;
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {});
  }

  async ngOnInit() {
    this.tittle = 'Ver Evaluación';
    this.evaluacion =
      await this.evaluacionCumplidoProvCrudService.getEvaluacion();
    await this.obtenerInformacionEvaluacion();

    if (
      this.evaluacion?.DocumentoId !== undefined &&
      this.evaluacion?.DocumentoId !== null
    ) {
      this.ConsultarDocumentoEvaluacion(this.evaluacion.DocumentoId);
    }
  }

  displayedColumns: any[] = [
    { def: 'Identificador', header: 'ID' },
    { def: 'Nombre', header: 'NOMBRE' },
    { def: 'FichaTecnica', header: 'DESCRIPCION' },
    { def: 'Cantidad', header: 'CANTIDAD' },
    { def: 'Unidad', header: 'UNIDAD' },
    { def: 'ValorUnitario', header: 'VALOR UNITARIO' },
    { def: 'Iva', header: 'IVA' },
  ];

  async obtenerInformacionEvaluacion() {
    await this.evaluacionCumplidoProvMidService
      .get('/informacion_evaluacion/' + this.asignacionEvaluadorId)
      .pipe(map((response: any) => response.Data as InformacionEvaluacion))
      .subscribe({
        next: (data: InformacionEvaluacion) => {
          this.informacionEvaluacion = data;
          this.informacionGeneralEvaluacion = {
            puntajeTotalEvaluacion:
              this.informacionEvaluacion.PuntajeTotalEvaluacion,
            clasificacion: this.informacionEvaluacion.Clasificacion,
            dependenciaEvaluadora:
              this.informacionEvaluacion.DependenciaEvaluadora,
            fechaEvaluacion: new Date(
              this.informacionEvaluacion.FechaEvaluacion
            ),
            nombreEvaluador: this.informacionEvaluacion.NombreEvaluador,
            cargo: this.informacionEvaluacion.Cargo,
            proveedor: this.informacionEvaluacion.EmpresaProveedor,
            objetoContrato: this.informacionEvaluacion.ObjetoContrato,
          };

          this.listaItemsEvaluar = this.informacionEvaluacion.ItemsEvaluados;
          this.ObtenerEstadoEvaluacion();
          this.listaEvaluadores = this.informacionEvaluacion.Evaluadores.map(
            (evaluador) => {
              return {
                numeroCedula: evaluador.Documento,
                cargo: evaluador.Cargo,
                itemsEvaluados: evaluador.ItemEvaluado,
                evaluacionDada: evaluador.PuntajeEvaluacion,
                porcentajeEvaluacion: evaluador.PorcentajeEvaluacion,
              };
            }
          );

          for (const evaluador of this.informacionEvaluacion.Evaluadores) {
            if (evaluador.Observaciones !== '') {
              this.listaObservaciones.push(evaluador.Observaciones);
            }
          }

          this.resultadoEvaluacion =
            this.informacionEvaluacion.ResultadoEvaluacion;

          this.loading = false;
        },
        error: (error: any) => {
          this.popUpManager.showErrorAlert(
            this.translate.instant(
              'Error al intentar cargar la información del evaluador'
            )
          );
        },
      });
  }

  async ObtenerEstadoEvaluacion() {
    await this.evaluacionCumplidoProvCrudService
      .get(`/asignacion_evaluador/${this.asignacionEvaluadorId}`)
      .pipe(map((response: any) => response.Data as AsignacionEvaluador))
      .subscribe({
        next: (data: AsignacionEvaluador) => {
          console.log('Asignacion Evaluacion', data);
          this.evaluacionCumplidoProvCrudService
            .get(
              `/cambio_estado_evaluacion/?query=EvaluacionId.Id:${data.EvaluacionId.Id},Activo:true&sortby=FechaCreacion&order=desc&limit:1`
            )
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
              },
            });
        },
        error: (error: any) => {
          this.popUpManager.showErrorAlert(
            this.translate.instant(
              'Error al intentar cargar la información del evaluador'
            )
          );
        },
      });
  }

  //Consulta el documento  en documentos crud y regresa la consulta de gestor documental
  async ConsultarDocumentoEvaluacion(
    idDocumentoEvaluacion: number
  ): Promise<GestorDocumental> {
    let evaluacion: GestorDocumental = {} as GestorDocumental;
    return new Promise((resolve, reject) => {
      this.documentosCrudService
        .get(`/documento/?limit=-1&query=Id.in:${idDocumentoEvaluacion}`)
        .subscribe({
          next: async (res: any) => {
            if (res.length > 0) {
              evaluacion = await this.ConsultarDocumentoPorEnlace(
                res[0].Enlace
              );
            }

            resolve(evaluacion);
          },
          error: (error: any) => {
            this.popUpManager.showErrorAlert(
              this.translate.instant(
                'Error al intentar cargar la información del documento de la evaluación'
              )
            );
          },
        });
    });
  }

  //Consulta el documento  en gestor documental
  async ConsultarDocumentoPorEnlace(url: string): Promise<GestorDocumental> {
    return new Promise((resolve, reject) => {
      this.gestotrDocumental.get(`/document/${url}`).subscribe({
        next: (res: any) => {
          if (res != null) {
            this.documentoEvalucion = res;
          }
          resolve(this.documentoEvalucion);
        },
        error: (error: any) => {
          this.popUpManager.showErrorAlert(
            this.translate.instant(
              'Error al intentar cargar la información del documento de la evaluación'
            )
          );
        },
      });
    });
  }

  async ModalVerEvaluacion() {
    const peticionFirmaElectronica: PeticionFirmaElectronicaEvaluacion = {
      PersonaId: '79777053',
      AsignacionId: this.asignacionEvaluadorId,
    };

    let modalVerEvaluacio = this.dialog.open(ModalVisualizarSoporteComponent, {
      disableClose: true,
      height: 'auto',
      width: 'auto',
      maxWidth: '60vw',
      maxHeight: '80vh',
      panelClass: 'custom-dialog-container',
      data: {
        url: this.documentoEvalucion.file,
        ModalButtonsFunc: [
          {
            Color: '#8c1a19',
            Text: 'Firmar',
            TextColor: '#ffffff',
            Function: async () => {
              this.firmaElectronicaService
                .FirmarEvaluacion(peticionFirmaElectronica)
                .then(async (res: RespuestaFirmaElectronica) => {
                  Swal.close();
                  modalVerEvaluacio.close();
                  if (res.res.Id != null && res.res != undefined) {
                    await this.ConsultarDocumentoEvaluacion(res.res.Id);
                    this.dialog.open(ModalVisualizarSoporteComponent, {
                      disableClose: true,
                      height: 'auto',
                      width: 'auto',
                      maxWidth: '60vw',
                      maxHeight: '80vh',
                      panelClass: 'custom-dialog-container',
                      data: {
                        url: this.documentoEvalucion.file,
                      },
                    });
                  }
                });
            },
          },
        ],
      },
    });
  }
}
