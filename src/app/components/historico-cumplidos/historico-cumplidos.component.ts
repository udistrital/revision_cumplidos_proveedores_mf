import { Acciones } from './../../models/acciones.model';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { Month } from 'src/app/models/month.model';
import { UtilsService } from 'src/app/services/utils.service';
import { Cumplido } from './../../models/cumplido';

@Component({
  selector: 'app-historico-cumplidos',
  templateUrl: './historico-cumplidos.component.html',
  styleUrls: ['./historico-cumplidos.component.css'],
})
export class HistoricoCumplidosComponent implements OnInit {
  constructor(private utilsService: UtilsService) {}
  estados: any[] = [];
  listaCumplidos:Cumplido[]=[]
  cumplidosCargados: boolean = false;

  displayedColumns = [
    { def: 'NumeroContrato', header: 'N° CONTRATO' },
    { def: 'Vigencia', header: 'VIGENCIA' },
    { def: 'Rp', header: 'RP' },
    { def: 'Periodo', header: 'PERIODO ' },
    { def: 'NombreProveedor', header: 'PROVEEDOR' },
    { def: 'Dependencia', header: 'DEPENDENCIA' },
    { def: 'Estado', header: 'ESTADO' },
    { def: 'TipoContrato', header: 'TipoContrato' },
    { def: 'acciones', header: 'ACCIONES', isAction: true },
  ];


  dataSource:any[]=[]
  ngOnInit(): void {
  }

  listarCumplidos(cumplidos:Cumplido[]){
    this.listaCumplidos=cumplidos
    this.cumplidosCargados = true
  }
  
 
}
