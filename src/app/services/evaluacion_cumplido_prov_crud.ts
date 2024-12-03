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

export class EvaluacionCumplidoProvCrudService {

  constructor(private requestManager: RequestManager) {
    this.requestManager.setPath('EVALUACION_CUMPLIDO_PROV_CRUD');
  }

  get(endpoint: string) {
    this.requestManager.setPath('EVALUACION_CUMPLIDO_PROV_CRUD');
    return this.requestManager.get(endpoint);
  }

  post(endpoint: any, element: any) {
    this.requestManager.setPath('EVALUACION_CUMPLIDO_PROV_CRUD');
    console.log("Data:", JSON.stringify(element));
    return this.requestManager.post(endpoint, element);
  }

  put(endpoint: any, element: any) {
    this.requestManager.setPath('EVALUACION_CUMPLIDO_PROV_CRUD');
    return this.requestManager.put(endpoint, element);
  }

  delete(endpoint: any, element: any) {
    this.requestManager.setPath('EVALUACION_CUMPLIDO_PROV_CRUD');
    return this.requestManager.delete(endpoint, element);
  }
}
