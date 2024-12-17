import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ItemAEvaluar } from 'src/app/models/item_a_evaluar';

@Component({
  selector: 'app-modal-items-no-agregados',
  templateUrl: './modal-items-no-agregados.component.html',
  styleUrls: ['./modal-items-no-agregados.component.scss']
})
export class ModalItemsNoAgregadosComponent {
  listaItems: ItemAEvaluar[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,private matDialogRef:MatDialogRef<ModalItemsNoAgregadosComponent>) { 
    this.listaItems = data.listaItems
  }

  displayedColumns = [
    { def: 'id', header: 'Id' },
    { def: 'nombre', header: 'Nombre' },
    { def: 'descripcion', header: 'Descripcion' },
    { def: 'cantidad', header: 'Cantidad' },
    { def: 'valor', header: 'Valor' },
    { def: 'iva', header: 'Iva' },
    { def: 'tipoNecesidad', header: 'Tipo Necesidad' },
  ];


  cerrarModaItemsNoCargados(){
    this.matDialogRef.close()
  }

  
}
