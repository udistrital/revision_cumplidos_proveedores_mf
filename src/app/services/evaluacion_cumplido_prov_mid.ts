import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { RequestManager } from '../managers/requestManager';

const httpOptions = {
  headers: new HttpHeaders({
      'Accept': 'application/json',
  }),
}

@Injectable({
  providedIn: 'root',
})

export class EvaluacionCumplidoProvMidService {

  constructor(private requestManager: RequestManager) {
    this.requestManager.setPath('EVALUACION_CUMPLIDO_PROV_MID');
  }

  get(endpoint: string) {
    this.requestManager.setPath('EVALUACION_CUMPLIDO_PROV_MID');
    return this.requestManager.get(endpoint);
  }

  post(endpoint: any, element: any) {
    this.requestManager.setPath('EVALUACION_CUMPLIDO_PROV_MID');
    return this.requestManager.post(endpoint, element);
  }

  put(endpoint: any, element: any) {
    this.requestManager.setPath('EVALUACION_CUMPLIDO_PROV_MID');
    return this.requestManager.put(endpoint, element);
  }

  delete(endpoint: any, element: any) {
    this.requestManager.setPath('EVALUACION_CUMPLIDO_PROV_MID');
    return this.requestManager.delete(endpoint, element);
  }
}
