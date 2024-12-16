import { Component, OnInit } from '@angular/core';
import { Evaluador } from 'src/app/models/evaluador';
import { ItemAEvaluar } from 'src/app/models/item_a_evaluar';
import { EvaluacionCumplidoProvCrudService } from './../../../services/evaluacion_cumplido_prov_crud';
import { EvaluacionCumplidosProveedoresMidService } from 'src/app/services/evaluacion_cumplidos_provedores_mid.service';
import { Evaluacion } from 'src/app/models/evaluacion_cumplidos_proiveedores_crud/evaluacion';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
    private router: Router
  ) {}
  async ngOnInit() {
    this.nombreProveedor = 'nombre Proveedor  tempotal';
    this.numeroContrato = 'numero de contrato tempotal';
    this.vigenciaContrato = 'vigenciaContrato tempotal';
    this.evaluacion = await this.evaluacionCumplidoProvCrud.getEvaluacion();
  }

  getPorcentaje(porcentaje: number) {
    this.porcentaje = porcentaje;
  }

  obtenerListaItems(event: any) {
    if (event != null) {
      this.listaItems = event;
    }
  }

  enviarEvaludoresAEvaluar() {
    console.log(this.evaluacion?.Id);
    try {
      this.evaluacionCumplidoMid
        .post(`/cambio-rol-evaluador/${1}`, null)
        .subscribe({
          next: (data) => {
            console.log(data);
          },
          complete: () => {
          
            this.router.navigate(['Listar-contratos-evaluar']);
            this.popUpManager.showSuccessAlert(
              'Evaluadores asignados correctamente'
            );
        
          },
          error: (err) => {
            this.popUpManager.showErrorAlert('Error al asignar evaluadores');

          },
        });
    } catch (error) {}
  }
}


