import { Injectable } from '@angular/core';
import { CumplidosProveedoresCrudService } from './cumplidos_proveedores_crud.service';
import { CumplidosProveedoresMidService } from './cumplidos_proveedores_mid.service';
import { catchError, map, Observable, of } from 'rxjs';
import { NotificacionBody } from '../models/notificacion.model';
import { NotificacionesService } from './notificaciones.service';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { BodyCambioEstado } from '../models/revision_cumplidos_proveedores_mid/body_cambio_estado.model';

@Injectable({
  providedIn: 'root',
})
export class CambioEstadoService {
  documentoResponsable: string = '';
  mensaje: string = '';
  documentoDestinatario: string = '';
  asunto: string = '';

  constructor(
    private cumplidos_provedore_mid_service: CumplidosProveedoresMidService,
    private cumplidos_provedore_crud_service: CumplidosProveedoresCrudService,
    private notificacionService: NotificacionesService,
    private popUpManager: PopUpManager
  ) {}

  obtenerEstado(codigoAbreviacion: string): Observable<number | null> {
    return this.cumplidos_provedore_crud_service
      .get(`/estado_cumplido?query=CodigoAbreviacion:${codigoAbreviacion}`)
      .pipe(
        map((response: any) => {
          if (response.Data != null && response.Data.length > 0) {
            return response.Data[0];
          }
          return null;
        }),
        catchError((error) => {
          console.error('Error', error);
          return of(null);
        })
      );
  }

  private solicituCambiarEstado(cambioEstado: BodyCambioEstado) {
    this.cumplidos_provedore_mid_service
      .post('/solicitud-pago/cambio-estado', cambioEstado)
      .subscribe(
        (response) => {
          console.log(cambioEstado);
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  async cambiarEstado(
    idCumplido: number,
    estadoCumplido: string,
  ) {
    try {

      const cambioEstado: BodyCambioEstado = {
        CumplidoProveedorId: idCumplido,
        CodigoAbreviacionEstadoCumplido: estadoCumplido,
      }
      this.solicituCambiarEstado(cambioEstado);

  

      if (this.mensaje != '') {
        try {
          console.log('Entro');
          //this.notificacionService.publicarNotificaciones(notificacion);
        } catch (error) {
          this.popUpManager.showErrorAlert(
            'Se generó un error al enviar la notificación.'
          );
        }
      }
    } catch (error) {
      this.popUpManager.showErrorAlert(
        'Error al intentar cambiar el estado.'
      );
    }
  }



}
