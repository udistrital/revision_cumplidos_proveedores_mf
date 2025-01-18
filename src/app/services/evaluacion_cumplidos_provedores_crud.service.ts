import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { RequestManager } from '../managers/requestManager';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpErrorManager } from '../managers/errorManager';
import { catchError, map } from 'rxjs/operators';
import { Evaluacion } from '../models/evaluacion_cumplidos_proiveedores_crud/evaluacion';
import { AsignacionEvaluador } from '../models/evaluacion_cumplido_prov_crud/asignacion_evaluador.model';

@Injectable({
  providedIn: 'root',
})
export class EvaluacionCumplidosProveedoresCrudService {
  public httpOptions: any;
  private evaluacionSubject: BehaviorSubject<Evaluacion | null> = new BehaviorSubject<Evaluacion | null>(null);
  private asignacionEvaluadorSubject: BehaviorSubject<AsignacionEvaluador | null> = new BehaviorSubject<AsignacionEvaluador | null>(null);
  asignacionEvaluador$ = this.asignacionEvaluadorSubject.asObservable();

  acces_token = '';
  constructor(
    private requestManager: RequestManager
  ) {
    this.requestManager.setPath('EVALUACION_CUMPLIDO_PROV_CRUD');
  
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

  get(endpoint: string) {
    console.log("Endpointget:", endpoint);
    this.requestManager.setPath('EVALUACION_CUMPLIDO_PROV_CRUD');
    return this.requestManager.get(endpoint);
  }
  post(endpoint: any, element: any) {
    this.requestManager.setPath('EVALUACION_CUMPLIDO_PROV_CRUD');
    return this.requestManager.post(endpoint, element);
    console.log("Endpointget:", endpoint);
  }

  

  
}
