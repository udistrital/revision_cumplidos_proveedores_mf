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
  anios: number[] = [];
  meses: Month[] = [];
  dependencias: any[] = [];
  estados: any[] = [];
  listaCumplidos:Cumplido[]=[]
  cumplidosCargados: boolean = false;

  displayedColumns = [
    { def: 'NumeroContrato', header: 'N° CONTRATO' },
    { def: 'Vigencia', header: 'VIGENCIA' },
    { def: 'Rp', header: 'RP' },
    { def: 'Mes', header: 'Mes ' },
    { def: 'FechaCambioEstado', header: 'FECHA APROBACION' },
    { def: 'NombreProveedor', header: 'PROVEEDOR' },
    { def: 'Dependencia', header: 'DEPENDENCIA' },
    { def: 'Estado', header: 'ESTADO' },
    { def: 'TipoContrato', header: 'TipoContrato' },
    { def: 'acciones', header: 'ACCIONES', isAction: true },
  ];


  dataSource:any[]=[]
  ngOnInit(): void {
    this.anios = this.utilsService.obternerAnios();
    this.meses = this.utilsService.obtenerMeses();
    this.dependencias=["DEP626", "Test"]

  }

  listarCumplidos(cumplidos:Cumplido[]){
    this.listaCumplidos=cumplidos
    this.cumplidosCargados = true
  }

}
