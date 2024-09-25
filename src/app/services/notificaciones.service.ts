import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { RequestManager } from '../managers/requestManager';
import { WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
import { UserService } from './user.services';
import { NotificacionBody } from '../models/notificacion.model';

@Injectable({
  providedIn: 'root',
})
export class NotificacionesService {
  private socket$: WebSocketSubject<any> | undefined;
  mensaje: string = '';
  documentoDestinatario: string = '';
  asunto: string = '';
  destinatarios:string[]=[]
  documentoResponsable!:string
  constructor(
    private userService: UserService,
    private requestManager: RequestManager
  ) {
    this.requestManager.setPath(environment.CUMPLIDOS_PROVEEDORES_CRUD_SERVICE);
  }

  connectWebSocket() {
    this.socket$ = new WebSocketSubject(environment.NOTIFICACION_MID_WS);
    this.socket$.subscribe();
    const userDocument = this.userService.getPayload().documento;
    this.socket$.next(userDocument.__zone_symbol_value);
  }

  post(endpoint: any, element: any) {
    this.requestManager.setPath('NOTIFICACIONES_CRUD')
    return this.requestManager.post(endpoint, element);
  }

  async publicarNotificaciones(estado:string,enopint:string) {
    await this.obteneMensaje(estado,enopint);
   const notificacion= this.crearNotificacion();
    const notificaciones: any = await new Promise((resolve, reject) => {
      this.post('/notificacion', notificacion).subscribe(
        response=>{
          console.log(response)
        },
        error=>{
          console.log(error)
        }
      );
    });

    this.connectWebSocket();

    if (this.socket$) {
      this.socket$.next(notificaciones.Data); 
    }
   
  }


  private crearNotificacion(){
    const notificacion:NotificacionBody=
    {sistema_id:"66c8afeca6ee77849101664d",
      tipo_notificacion_id:"66ac05deb6d4007375621835",
      destinatarios:this.destinatarios,
      remitente:this.userService.getPayload().documento,
      asunto:this.asunto, 
      mensaje:  this.mensaje,
      lectura:false ,
      metadatos:{} ,
      activo:true ,
    }
     return notificacion;
  }


  private async obteneMensaje(estado: string,endpoint:string) {
    console.log('obtenerAsunto', estado);
    switch (estado) {
      case 'PRO':
        this.mensaje = 'Contratación te asignó una de cumplido proveedor';
        this.asunto = 'Asignacion de Cumplido';
        await this.obtenerDestinatario(endpoint);
        this.destinatarios.push(this.documentoResponsable)
        break;
      case 'PRC':
        this.mensaje = 'El supervisor te asignó una de cumplido proveedor';
        this.asunto = 'Asignacion de Cumplido';
        break;
      case 'AO':
        this.mensaje =
          'El ordenador ha aprobado una solicitud de cumplido proveedor';
        this.asunto = 'Aprobacion de Cumplido';
        await this.obtenerDestinatario(endpoint);
        this.destinatarios.push(this.documentoResponsable)
        break;
      case 'RO':
        this.mensaje =
          'El Ordenador rechazo  la solicitud de  cumplido proveedor';
        this.asunto = 'Rechazo de Cumplido';
        break;
      case 'RC':
        this.mensaje =
          'Contratación ha rechazado la solicitud de cumplido proveedor';
          this.asunto = 'Rechazo de Cumplido';
          await this.obtenerDestinatario(endpoint);
         this.destinatarios.push(this.documentoResponsable)
        break;
      default:
        this.mensaje = '';
        break;
    }
  }

  private async obtenerDestinatario(endPoint:string){
    this.documentoResponsable = await this.userService.obtenerResponsable(endPoint);
   }
 


}
