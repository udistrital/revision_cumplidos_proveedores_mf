import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { RequestManager } from '../managers/requestManager';
import { Evaluacion } from '../models/evaluacion_cumplidos_proiveedores_crud/evaluacion';
import { BehaviorSubject, Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
      'Accept': 'application/json',
  }),
}

@Injectable({
  providedIn: 'root',
})

export class EvaluacionCumplidoProvCrudService {

  public httpOptions: any; 

  private evaluacionSubject: BehaviorSubject<Evaluacion | null> = new BehaviorSubject<Evaluacion | null>(null)

  constructor(private requestManager: RequestManager,  ) {
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


  
  async setEvaluacion(evaluacion: Evaluacion | null):Promise<void> {
    return new Promise((resolve) => {
     this.evaluacionSubject.next(evaluacion);
     resolve();
    })
 
   }
 
   async getEvaluacion(): Promise<Evaluacion | null> {
    return new Promise((resolve) => {
      this.evaluacionSubject.asObservable().subscribe({
        next: (evaluacion) => {
          resolve(evaluacion);
        },
      });
    });
  }

  

  
}