import { Component, OnInit } from '@angular/core';
import { Month } from 'src/app/models/month.model';
import { UtilsService } from 'src/app/services/utils.service';

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
  ngOnInit(): void {
    this.anios = this.utilsService.obternerAnios();
    this.meses = this.utilsService.obtenerMeses();
    this.estados=["Aprobado", "Rechazado"]
    this.dependencias=["Test1", "Test"]
  }
}
