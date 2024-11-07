import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Button } from 'src/app/models/button.model';
import { EstadoCumplido } from 'src/app/models/cambio_estado';
import { SoporteEstados } from 'src/app/models/documento_historico';
import { ModalSoportesCumplidoData } from 'src/app/models/modal-soporte-cumplido-data.model';
import { CambioEstadoCumplido } from 'src/app/models/revision_cumplidos_proveedores_crud/cambio-estado-cumplio.model';
import { InformacionSoporteCumplido } from 'src/app/models/revision_cumplidos_proveedores_mid/informacion_soporte_cumplido.model';

@Component({
  selector: 'app-modal-historico',
  templateUrl: './modal-historico.component.html',
  styleUrls: ['./modal-historico.component.css'],
})
export class ModalHistoricoComponent {

  listaEstadosCumplidos:EstadoCumplido[]=[]
  listaDocumentosCargados:InformacionSoporteCumplido[]=[]
  Buttons!:Button[];

  constructor(public dialogRef: MatDialogRef<ModalHistoricoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){
      console.log(data)
      this.listaEstadosCumplidos= this.data.listaEstadosCumplidos;
      this.listaDocumentosCargados=this.data.listaDocumentosCargados;
      this.Buttons=this.data.Buttons
      console.log(this.listaDocumentosCargados)
      console.log(this.listaDocumentosCargados)
      console.log(this.listaDocumentosCargados)
    }

    cambioEstadoCumplido!:CambioEstadoCumplido;

}
