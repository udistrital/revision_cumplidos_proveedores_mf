import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalCargaSoprotesComponent } from '../modal-carga-soprotes/modal-carga-soprotes.component';

@Component({
  selector: 'app-tabla-carga-soportes',
  templateUrl: './tabla-carga-soportes.component.html',
  styleUrls: ['./tabla-carga-soportes.component.scss']
})
export class TablaCargaSoportesComponent {


  constructor(public dialog: MatDialog) {}
  openCargaSoportes() {
    this.dialog.open(ModalCargaSoprotesComponent,{
      disableClose: true,
      maxHeight:"80vw",
      maxWidth:"100vw",
      height: "80vh",
      width:"80%"
    });
  }
  


  displayedColumns: string[] = ['numeroContrato', 'vigencia', 'rp', 'vigenciaRp', 'fechaCrecion', 'dependencia', 'acciones'];
  dataSource = [
    { 
      numeroContrato: '001', 
      vigencia: '2023', 
      rp: 'Valor de RP', 
      mes: 'Enero', 
      fechaCrecion: '2023-01-01', 
      dependencia: 'Departamento A', 
      acciones: 'Editar, Eliminar'
    },
    { 
      numeroContrato: '002', 
      vigencia: '2024', 
      rp: 'Otro valor de RP', 
      mes: 'Febrero', 
      fechaCrecion: '2024-02-15', 
      dependencia: 'Departamento B', 
      acciones: 'Ver detalles'
    },
  ];

}
