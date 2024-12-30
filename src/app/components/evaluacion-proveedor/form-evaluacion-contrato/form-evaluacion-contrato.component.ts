import { Component, OnInit } from '@angular/core';
import { AsignacionEvaluador } from 'src/app/models/evaluacion_cumplido_prov_crud/asignacion_evaluador.model';
import { Evaluacion } from 'src/app/models/evaluacion_cumplido_prov_crud/evaluacion.model';
import { Item } from 'src/app/models/evaluacion_cumplido_prov_crud/item.model';
import { EvaluacionCumplidoProvCrudService } from 'src/app/services/evaluacion_cumplido_prov_crud';
import { map } from 'rxjs';
import { PopUpManager } from 'src/app/managers/popUpManager';

@Component({
  selector: 'app-form-evaluacion-contrato',
  templateUrl: './form-evaluacion-contrato.component.html',
  styleUrls: ['./form-evaluacion-contrato.component.scss'],
})
export class FormEvaluacionContratoComponent implements OnInit {
  panelEvaluacion: boolean = false;
  asignacionEvaluador!: AsignacionEvaluador;
  evaluacion!: Evaluacion | null;
  listaItems: Item[] = [];

  constructor(
    private evaluacionCumplidosCrud: EvaluacionCumplidoProvCrudService,
    private evaluacionCumplidoProvCrudService: EvaluacionCumplidoProvCrudService,
    private popUpManager: PopUpManager
  ) {}

  displayedColumns = [
    { def: 'Identificador', header: 'Identificador' },
    { def: 'Nombre', header: 'Nombre' },
    { def: 'FichaTecnica', header: 'FichaTecnica' },
    { def: 'Unidad', header: 'Unidad' },
    { def: 'Cantidad', header: 'Cantidad' },
    { def: 'ValorUnitario', header: 'ValorUnitario' },
    { def: 'Iva', header: 'Iva' },
    { def: 'TipoNecesidad', header: 'TipoNecesidad' },
  ];

  async ngOnInit(): Promise<void> {
   await this.consularItems();
    this.evaluacionCumplidoProvCrudService.asignacionEvaluador$.subscribe(
      (asignacion) => {
        if (asignacion) {
          this.asignacionEvaluador = asignacion;
          console.log(this.asignacionEvaluador);
          this.evaluacion = asignacion.EvaluacionId;
        }
      }
    );

    console.log("listaItems", this.listaItems);
  }

  async consularItems(): Promise<Item[]> {
    return new Promise((resolve, reject) => {
      this.evaluacionCumplidosCrud
        .get(`/asignacion_evaluador_item?query=AsignacionEvaluadorId.Id:${this.asignacionEvaluador.Id}`)
        .subscribe({
          next: (asignacion: any) => {
            this.listaItems = asignacion.Data.map((itemId: any) => {
              return {
                Id: itemId.ItemId.Id,
                EvaluacionId:  itemId.ItemId.EvaluacionId,
                Identificador: itemId.ItemId.Identificador,
                Nombre: itemId.ItemId.Nombre,
                ValorUnitario: itemId.ItemId.ValorUnitario,
                Iva: itemId.ItemId.Iva,
                FichaTecnica: itemId.ItemId.FichaTecnica,
                Unidad: itemId.ItemId.Unidad,
                Cantidad: itemId.ItemId.Cantidad,
                TipoNecesidad: this.obtenerTipoNecesidad(itemId.ItemId.TipoNecesidad),
                Activo: itemId.ItemId.Activo,
                FechaCreacion: itemId.ItemId.FechaCreacion,
                FechaModificacion: itemId.ItemId.FechaModificacion,
              };
            });
            resolve(this.listaItems);
          },error: (error) => {
            this.popUpManager.showErrorAlert('Error al obtener los items de la evaluación');
          },
        });
    });
  }


  obtenerTipoNecesidad(tipoNecesidad: number): string {

    if (tipoNecesidad === 1) {
      return 'BIEN';
    } 
     if (tipoNecesidad === 2) {
      return 'SERVICIO';
    } 
    if (tipoNecesidad === 3) {
      return 'BIENES Y SERVICIOS';
    }
      return 'No definido';
    }
  }

