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
export class EvaluacionCumplidosProveedoresCrudService {
  public httpOptions: any;
  acces_token = '';
  constructor(
    private requestManager: RequestManager
  ) {
    this.requestManager.setPath('EVALUACION_CUMPLIDOS_PROVEEDORES_CRUD');
  
  }

  get(endpoint: string) {
    this.requestManager.setPath('EVALUACION_CUMPLIDOS_PROVEEDORES_CRUD');
    return this.requestManager.get(endpoint);
  }
  post(endpoint: any, element: any) {
    this.requestManager.setPath('EVALUACION_CUMPLIDOS_PROVEEDORES_CRUD');
    return this.requestManager.post(endpoint, element);
  }

  
}
