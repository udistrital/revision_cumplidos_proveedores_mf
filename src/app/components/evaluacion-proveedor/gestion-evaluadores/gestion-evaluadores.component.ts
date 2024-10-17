import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gestion-evaluadores',
  templateUrl: './gestion-evaluadores.component.html',
  styleUrls: ['./gestion-evaluadores.component.scss'],
})
export class GestionEvaluadoresComponent implements OnInit {
  nombreProveedor!: string;
  numeroContrato!: string;
  vigenciaContrato!: string;

  ngOnInit(): void {
    this.nombreProveedor = 'nombre Proveedor  tempotal';
    this.numeroContrato = 'numero de contrato tempotal';
    this.vigenciaContrato = 'vigenciaContrato tempotal';
    
  }
}
