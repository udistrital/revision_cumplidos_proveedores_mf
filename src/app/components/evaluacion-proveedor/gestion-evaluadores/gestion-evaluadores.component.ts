import { Component, OnInit } from '@angular/core';
import { Evaluador } from 'src/app/models/evaluador';


@Component({
  selector: 'app-gestion-evaluadores',
  templateUrl: './gestion-evaluadores.component.html',
  styleUrls: ['./gestion-evaluadores.component.scss'],
})
export class GestionEvaluadoresComponent implements OnInit {
  nombreProveedor!: string;
  numeroContrato!: string;
  vigenciaContrato!: string;
  porcentaje:number=0

  ngOnInit(): void {
    this.nombreProveedor = 'nombre Proveedor  tempotal';
    this.numeroContrato = 'numero de contrato tempotal';
    this.vigenciaContrato = 'vigenciaContrato tempotal';
    
  }

  

  getPorcentaje(porcentaje: number){
    this.porcentaje = porcentaje;
    console.log(this.porcentaje)
  }


 
}
