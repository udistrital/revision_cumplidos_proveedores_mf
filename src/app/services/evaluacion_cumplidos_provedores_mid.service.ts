import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { RequestManager } from '../managers/requestManager';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpErrorManager } from '../managers/errorManager';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EvaluacionCumplidosProveedoresMidService {
  public httpOptions: any;
  acces_token = '';
  constructor(
    private requestManager: RequestManager,
    private http: HttpClient,
    private errManager: HttpErrorManager
  ) {
    this.requestManager.setPath('EVALUACION_CUMPLIDO_PROV_MID');
    const acces_token = window.localStorage.getItem('access_token');
  }

  get(endpoint: string) {
    this.requestManager.setPath('EVALUACION_CUMPLIDO_PROV_MID');
    return this.requestManager.get(endpoint);
  }
  post(endpoint: any, element: any) {
    this.requestManager.setPath('EVALUACION_CUMPLIDO_PROV_MID');
    return this.requestManager.post(endpoint, element);
  }

  // postCargaExcel(data: any) {const acces_token = window.localStorage.getItem('access_token');

  //   this.requestManager.setPath('EVALUACION_CUMPLIDOS_PROVEEDORES_MID');
  //   this.requestManager.post_file('carga_excel', data)
  // }

  postCargaExcel(endpoint: any, element: any) {
    this.requestManager.setPath('EVALUACION_CUMPLIDO_PROV_MID');
    return this.requestManager.postFIle(endpoint, element);
  }
}
