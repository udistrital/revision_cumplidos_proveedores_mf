import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { RequestManager } from '../managers/requestManager';
import { JbpmService } from './jbpm_service.service';
import { AletManagerService } from '../managers/alert-manager.service';
import { AdministrativaAmazonService } from './administrativa_amazon.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private jbmpServie: JbpmService,
    private alertService: AletManagerService,
    private administrativaAmazonService: AdministrativaAmazonService
  ) {}

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
      console.log("responable",response)
     // return response.documento as string;
     return "null";
    } catch (error) {
      console.error('Error al obtener el documento:', error);
      throw new Error('Error al obtener el documento');
    }
  }

  public obtenerInformacionPersona(): Observable<any> {
    const infoPerson = this.administrativaAmazonService.get(
      '/informacion_persona_natural?query=Id:' + this.getPayload().documento
    );

    return infoPerson;
  }

  public obtenerInformacionContrato(numeroContrato:string,vigencia:string): Observable<any> {
    const infoProveedor = this.administrativaAmazonService.get(
      `/contrato_general/?query=ContratoSuscrito.NumeroContratoSuscrito:${numeroContrato},VigenciaContrato:${vigencia}`
    );

    return infoProveedor;
  }

  public obtenerInformacioProveedor(idProoveedor:string): Observable<any> {
    const infoProveedor = this.administrativaAmazonService.get(
      `/informacion_proveedor/?query=Id:${idProoveedor}`
    );

    return infoProveedor;
  }
}
