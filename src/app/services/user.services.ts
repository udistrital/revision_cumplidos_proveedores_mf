import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { RequestManager } from '../managers/requestManager';
import { JbpmService } from './jbpm_service.service';
import { AletManagerService } from '../managers/alert-manager.service';

@Injectable({
  providedIn: 'root',
})


export class UserService{

constructor(private jbmpServie:JbpmService,private alertService:AletManagerService){

}

  public getPayload(): any {
    var payload: any = {};
    const idToken = window.localStorage.getItem('id_token')?.split('.');
    if (idToken != undefined) {
      payload = JSON.parse(atob(idToken[1]));
    }
    return payload;
  }

  async obtenerResponsable(endpoint: string): Promise<string> {
    try {
      const response: any = await this.jbmpServie.get(endpoint).toPromise();
      return response.documento as string;
    } catch (error) {
      console.error('Error al obtener el documento:', error);
      throw new Error('Error al obtener el documento');
    }
  }
}

