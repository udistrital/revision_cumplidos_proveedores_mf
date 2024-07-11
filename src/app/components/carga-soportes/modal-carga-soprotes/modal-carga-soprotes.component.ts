import { Component } from '@angular/core';

@Component({
  selector: 'app-modal-carga-soprotes',
  templateUrl: './modal-carga-soprotes.component.html',
  styleUrls: ['./modal-carga-soprotes.component.css']
})
export class ModalCargaSoprotesComponent {

  displayedColumns: string[] = ['noSolicitud', 'numeroContrato', 'fechaCreacion', 'periodo', 'estadoSoliciatud', 'acciones'];
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

  getAnios(): number[] {
    const anioActual = new Date().getFullYear();
    const anios: number[] = [];

    for (let i = 2017; i <= anioActual; i++) {
        anios.push(i);
    }

    return anios;
  }



  getMeses(): string[] {
    return [
        "Enero", "Febrero", "Marzo", "Abril",
        "Mayo", "Junio", "Julio", "Agosto",
        "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
  }

  
}
