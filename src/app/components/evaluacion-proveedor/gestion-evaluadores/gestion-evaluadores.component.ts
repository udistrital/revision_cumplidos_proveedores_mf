import { Component, OnInit } from '@angular/core';
import { Evaluador } from 'src/app/models/evaluador';
import { ItemAEvaluar } from 'src/app/models/item_a_evaluar';
import { EvaluacionCumplidoProvCrudService } from './../../../services/evaluacion_cumplido_prov_crud';
import { EvaluacionCumplidosProveedoresMidService } from 'src/app/services/evaluacion_cumplidos_provedores_mid.service';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Evaluacion } from 'src/app/models/evaluacion_cumplido_prov_crud/evaluacion.model';
import { AdministrativaAmazonService } from 'src/app/services/administrativa_amazon.service';
import { EstadoEvaluacion } from 'src/app/models/evaluacion_cumplido_prov_crud/estado_evaluacion.model';
import { map } from 'rxjs';
import { BodyCambioEstadoEvaluacion, CambioEstadoEvaluacion } from 'src/app/models/evaluacion_cumplido_prov_crud/cambio_estado_evaluacion.model';
import { AsignacionEvaluador } from 'src/app/models/evaluacion_cumplido_prov_crud/asignacion_evaluador.model';

@Component({
  selector: 'app-gestion-evaluadores',
  templateUrl: './gestion-evaluadores.component.html',
  styleUrls: ['./gestion-evaluadores.component.scss'],
})
export class GestionEvaluadoresComponent implements OnInit {
  nombreProveedor!: string;
  numeroContrato!: string;
  vigenciaContrato!: string;
  porcentaje: number = 0;
  listaItems: ItemAEvaluar[] = [];
  evaluacion!: Evaluacion | null;

  constructor(
    private evaluacionCumplidoMid: EvaluacionCumplidosProveedoresMidService,
    private evaluacionCumplidoProvCrud: EvaluacionCumplidoProvCrudService,
    private popUpManager: PopUpManager,
    private router: Router,
    private administrativaAmazonCrud: AdministrativaAmazonService,
  ) {}
  async ngOnInit() {


    await this.evaluacionCumplidoProvCrud.evaluacion$.subscribe({
      next: (data) => {
        this.evaluacion = data;
      },
    })

    this.numeroContrato = String( this.evaluacion?.ContratoSuscritoId);
    this.vigenciaContrato = String( this.evaluacion?.VigenciaContrato);

    this.obtenerProveedorContrato();

  }

  getPorcentaje(porcentaje: number) {
    this.porcentaje = porcentaje;
  }

  obtenerListaItems(event: any) {
    if (event != null) {
      this.listaItems = event;
    }
  }

  async enviarNotificacionEvaluadores(){
    await this.evaluacionCumplidoProvCrud
    .evaluacion$.subscribe((evaluacion) => {
      if (evaluacion){
        this.evaluacion = evaluacion;
      }
    })
    await this.evaluacionCumplidoMid
    .get(`/notificaciones/${this.evaluacion?.Id}`)
    .subscribe({
      error: (error) => {
        this.popUpManager.showErrorAlert('No se pudieron enviar las notificaciones');
      }
    })
  }


  async enviarEvaluacion() {
    if (await this.obtenerPorcentajeTotalEvaluacion() !== 1) {
      this.popUpManager.showErrorAlert('No se ha completado el 100% de la evaluación, edite los porcentajes de evaluación, agregue más evaluadores o verifique que ya guardo todos los evaluadores.');
      return
    }
    let confirm = await this.popUpManager.showConfirmAlert(
      '¿Esta seguro que desea terminar la gestion y enviar la evaluación?'
    );
    if (confirm.isConfirmed) {

      await this.evaluacionCumplidoProvCrud
      .get(`/estado_evaluacion/?query=CodigoAbreviacion:EPR,Activo:true&limit=-1`)
      .pipe(
        map((res: any) => res.Data as EstadoEvaluacion[])
      )
      .subscribe({
        next: async (data: EstadoEvaluacion[]) => {
          await this.desactivarEstadosAnterioresEvaluacion();
          let body: BodyCambioEstadoEvaluacion = {
            EvaluacionId: {
              Id: this.evaluacion?.Id,
            },
            EstadoEvaluacionId: {
              Id: data[0].Id,
            },
          }
          await this.evaluacionCumplidoProvCrud
          .post(`/cambio_estado_evaluacion`, body)
          .subscribe({
            next: (data) => {
              this.popUpManager.showSuccessAlert('Evaluación enviada correctamente');
              this.evaluacionCumplidoProvCrud.removeEvaluacion();
              this.evaluacionCumplidoProvCrud.removeAsignacionEvaluador();
              this.router.navigate(['listar-contratos-evaluar']);

            },
            error: (error) => {
              console.log("Error", error)
              this.popUpManager.showErrorAlert('No se pudo enviar la evaluación');
            }
          })
        },
        error: (error: any) => {
          console.log("Error", error)
          this.popUpManager.showErrorAlert('No se pudo enviar la evaluación');
        }
      })
      await this.enviarNotificacionEvaluadores();
    }
  }

  async obtenerPorcentajeTotalEvaluacion(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.evaluacionCumplidoProvCrud
        .get(`/asignacion_evaluador?query=EvaluacionId.Id:${this.evaluacion?.Id},Activo:true&limit=-1`)
        .pipe(
          map((res: any) => res.Data as AsignacionEvaluador[])
        )
        .subscribe({
          next: (data: AsignacionEvaluador[]) => {
            let porcentaje = 0;
            if (data[0].Id !== undefined) {
              data.forEach((asignacion) => {
                porcentaje += asignacion.PorcentajeEvaluacion;
              });
            }
            resolve(porcentaje);
          },
          error: (error) => {
            reject(error);
          }
        });
    });
  }

  async desactivarEstadosAnterioresEvaluacion(){
    await this.evaluacionCumplidoProvCrud
    .evaluacion$.subscribe((evaluacion) => {
      if (evaluacion){
        this.evaluacion = evaluacion;
      }
    })
    await this.evaluacionCumplidoProvCrud
    .get(`/cambio_estado_evaluacion/?query=EvaluacionId.Id:${this.evaluacion?.Id},Activo:true&limit=-1`)
    .pipe(
      map ((res:any) => res.Data as CambioEstadoEvaluacion[])
    )
    .subscribe({
      next: async (data:CambioEstadoEvaluacion[]) => {
        console.log("Data", data[0].Id)
        if (data[0].Id !== undefined){
          data.forEach(async (cambioEstado) => {
            await this.evaluacionCumplidoProvCrud
            .delete(`/cambio_estado_evaluacion`, cambioEstado.Id)
            .subscribe({

            })
          })
        }
      },
      error: (error: any) => {
        this.popUpManager.showErrorAlert('No fue posible desactivar los estados anteriores de la evaluación')
      }
    })
  }



  async obtenerProveedorContrato(){
    await this.administrativaAmazonCrud
    .get(`/contrato_general/?query=ContratoSuscrito.NumeroContratoSuscrito:${this.numeroContrato},ContratoSuscrito.Vigencia:${this.vigenciaContrato}`)
    .subscribe({
      next: async (data: any) => {
        await this.administrativaAmazonCrud
        .get(`/informacion_proveedor/?query=Id:${data[0].Contratista}`)
        .subscribe({
          next: (proveedor: any) => {
            this.nombreProveedor = proveedor[0].NomProveedor
          },
          error: (error) => {
            this.popUpManager.showErrorAlert('No se pudo obtener el proveedor');
          }
        })
      },
      error: (error: any) => {
        this.popUpManager.showErrorAlert('No se pudo obtener el contrato general del proveedor');
      }
    })
  }
}


