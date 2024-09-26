import { Injectable } from '@angular/core';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { UtilsService } from './utils.service';
import { Mode } from '../models/modal-soporte-cumplido-data.model';

@Injectable({
  providedIn: 'root'
})
export class ModoService {

  constructor(
    private cumplidosMidServices: CumplidosProveedoresMidService,
    private popUpManager: PopUpManager,
    private utilService:UtilsService
  ) { }

  obtenerModo(codigoAbreviacionCumplido: string): Mode {
    switch (codigoAbreviacionCumplido) {
      case 'CD':
        return Mode.CD;
      case 'RC':
        return Mode.PRC;
      case 'RO':
        return Mode.RO;
      case 'AO':
        return Mode.AO;
      case 'PRO':
        return Mode.PRO;
      default:
        return Mode.PRC;
    }
  }
}
