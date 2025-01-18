import { Component, Input, signal, SimpleChanges } from '@angular/core';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { Item } from 'src/app/models/evaluacion_cumplido_prov_crud/item.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-visualizar-items',
  templateUrl: './visualizar-items.component.html',
  styleUrls: ['./visualizar-items.component.scss']
})
export class VisualizarItemsComponent {

  tittle!: string;
  readonly panelOpenState = signal(false);
  @Input({required: true}) listaItems: Item[] = [];
  dataSource: any[] = [];
  unidadesCargadas: boolean = false;

  constructor(
    private utilsService:UtilsService,
    private popUpManager: PopUpManager 
  ){
    this.tittle = "Items evaluados"

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['listaItems'] && this.listaItems.length > 0) {
      this.obtenerUnidades(this.listaItems);
    }
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

  async obtenerUnidades(items: Item[]){

    for (const item of items){
      try{
        const unidadMedida = await this.utilsService.obtenerMedida(Number(item.Unidad));
        const nombreUnidad = unidadMedida ? unidadMedida.Unidad : '';

        const itemTransformado: any = {
          ...item,
          Unidad: nombreUnidad
        };

        this.dataSource.push(itemTransformado);
      } catch(error){
        this.popUpManager.showErrorAlert('No se pudo obtener la unidad de medida');
      }
    }
    this.dataSource.sort((a, b) => a.Id - b.Id);
    this.unidadesCargadas = true;
  }

}
