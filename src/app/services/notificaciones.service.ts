import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { RequestManager } from '../managers/requestManager';
import { WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
import { UserService } from './user.services';

@Injectable({
  providedIn: 'root',
})
export class NotificacionesService {
  private socket$: WebSocketSubject<any> | undefined;

  constructor(
    private userService: UserService,
    private requestManager: RequestManager
  ) {
    this.requestManager.setPath(environment.CUMPLIDOS_PROVEEDORES_CRUD_SERVICE);
  }

  connectWebSocket(docUsuario: string) {
    this.socket$ = new WebSocketSubject(environment.NOTIFICACION_MID_WS);
    this.socket$.subscribe();
    const userDocument = this.userService.getPayload().documento;
    this.socket$.next(userDocument.__zone_symbol_value);
  }

  post(endpoint: any, element: any) {
    this.requestManager.setPath('NOTIFICACIONES_CRUD');
    return this.requestManager.post(endpoint, element);
  }

  async publicarNotificaciones(notificacion: Notification): Promise<any[]> {
    const notificaciones: any = await new Promise((resolve, reject) => {
      this.post('NOTIFICACIONES_CRUD', notificacion).subscribe(
        (data: any) => resolve(data),
        (error: any) => reject(error)
      );
    });
    return notificaciones.Data;
  }


}
