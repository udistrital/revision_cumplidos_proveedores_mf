import { Injectable } from '@angular/core';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UtilsService } from './utils.service';
import { InformacionSoporteCumplido } from '../models/revision_cumplidos_proveedores_mid/informacion_soporte_cumplido.model';

@Injectable({
  providedIn: 'root'
})
export class SoportesService {

  constructor(
    private cumplidosMidServices: CumplidosProveedoresMidService,
    private popUpManager: PopUpManager,
    private utilService:UtilsService
  ) { }

  getDocumentosCumplidos(cumplido_proveedor: number): Observable<InformacionSoporteCumplido[]> {
    return this.cumplidosMidServices.get('/solicitud-pago/soportes/' + cumplido_proveedor).pipe(
      map((res: any) => {

        if (res.Data==null){
          return []
        }
        return res.Data.map((soporte: InformacionSoporteCumplido) => {
          soporte.Documento.FechaCreacion=this.utilService.formatearFecha(soporte.Documento.FechaCreacion)
          return soporte
        });
      }),
      catchError((error: any) => {
        //console.log(error)
        //this.popUpManager.showErrorAlert('No fue posible obtener los documentos del cumplido');
        throw error;
      })
    );
  }
}
