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

      await this.obteneMensaje(estadoCumplido);
      const notificacion:NotificacionBody = {
        sistema_id: '66c8afeca6ee77849101664d',
        tipo_notificacion_id: '66ac05deb6d4007375621835',
        destinatarios: ['265313'],
        remitente: "265313",
        asunto: this.asunto,
        mensaje: this.mensaje,
        lectura: false,
        metadatos: {},
        activo: true
      }

      if (this.mensaje != '') {
        try {
          console.log('Entro');
          this.notificacionService.publicarNotificaciones(notificacion);
        } catch (error) {
          this.popUpManager.showErrorAlert(
            'Se genero un error al enviar la notificación'
          );
        }
      }
    } catch (error) {
      this.popUpManager.showErrorAlert(
        'Error al cambiar el estado'
      );
    }
  }

  private async obteneMensaje(estado: string) {
    console.log('obtenerAsunto', estado);
    switch (estado) {
      case 'PRO':
        this.mensaje = 'Contratación te asignó una de cumplido proveedor';
        this.asunto = 'Asignacion de Cumplido';
        break;
      case 'PRC':
        this.mensaje = 'El supervisor te asignó una de cumplido proveedor';
        this.asunto = 'Asignacion de Cumplido';
        break;
      case 'AO':
        this.mensaje =
          'El ordenador ha aprobado una solicitud de cumplido proveedor';
        this.asunto = 'Aprobacion de Cumplido';
        break;
      case 'RO':
        this.mensaje =
          'El Ordenador rechazo  la solicitud de  cumplido proveedor';
        this.asunto = 'Rechazo de Cumplido';
        break;
      case 'RC':
        this.mensaje =
          'Contratación ha rechazado la solicitud de cumplido proveedor';
        break;
      default:
        this.mensaje = '';
        break;
    }
  }

}
