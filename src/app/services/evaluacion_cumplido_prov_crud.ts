import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { RequestManager } from '../managers/requestManager';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AsignacionEvaluador } from '../models/evaluacion_cumplido_prov_crud/asignacion_evaluador.model';
import { PopUpManager } from '../managers/popUpManager';
import { Evaluacion } from '../models/evaluacion_cumplido_prov_crud/evaluacion.model';

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



  private evaluacionSubject: BehaviorSubject<Evaluacion | null>;
  private asignacionEvaluadorSubject: BehaviorSubject<AsignacionEvaluador | null>;

  public asignacionEvaluador$: Observable<AsignacionEvaluador | null>;
  public evaluacion$: Observable<Evaluacion | null>;

  constructor(
    private requestManager: RequestManager,
    private popUpManager: PopUpManager
  ) {
    this.requestManager.setPath('EVALUACION_CUMPLIDO_PROV_CRUD');

     // Inicializar subjects con valores desde localStorage
     const storedEvaluacion = sessionStorage.getItem('evaluacion');
     const storedAsignacionEvaluador = sessionStorage.getItem('asignacionEvaluador');

     this.evaluacionSubject = new BehaviorSubject<Evaluacion | null>(
      storedEvaluacion ? JSON.parse(storedEvaluacion) : null
    );
    this.asignacionEvaluadorSubject = new BehaviorSubject<AsignacionEvaluador | null>(
      storedAsignacionEvaluador ? JSON.parse(storedAsignacionEvaluador) : null
    );

    this.asignacionEvaluador$ = this.asignacionEvaluadorSubject.asObservable();
    this.evaluacion$ = this.evaluacionSubject.asObservable();

  }


  get(endpoint: string) {
    this.requestManager.setPath('EVALUACION_CUMPLIDO_PROV_CRUD');
    return this.requestManager.get(endpoint);
  }

  post(endpoint: any, element: any) {
    this.requestManager.setPath('EVALUACION_CUMPLIDO_PROV_CRUD');
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



  setEvaluacion(evaluacion: Evaluacion) {
    this.evaluacionSubject.next(evaluacion);
    sessionStorage.setItem('evaluacion', JSON.stringify(evaluacion));
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

  removeEvaluacion(){
    this.evaluacionSubject.next(null);
    sessionStorage.removeItem('evaluacion');
  }



  setAsignacionEvaluador(asignacionEvaluador: AsignacionEvaluador){
    this.asignacionEvaluadorSubject.next(asignacionEvaluador);
    sessionStorage.setItem('asignacionEvaluador', JSON.stringify(asignacionEvaluador));
  }

  removeAsignacionEvaluador(){
    this.asignacionEvaluadorSubject.next(null);
    sessionStorage.removeItem('asignacionEvaluador')
  }

  setAsignacionEvaluadorWithId(asignacion_evaluador_id: number){
    this.get(`/asignacion_evaluador/${asignacion_evaluador_id}`)
    .pipe(
      map((response:any) => response.Data as AsignacionEvaluador)
    )
    .subscribe({
      next: (data:AsignacionEvaluador) => {
        this.setAsignacionEvaluador(data);
      },
      error: (error: any) => {
        this.popUpManager.showErrorAlert('Error al obtener la asignación del evaluador');
      }
    })
  }

  setEvaluacionWithId(evaluacion_id: number){
    this.get(`/evaluacion/${evaluacion_id}`)
    .pipe(
      map((response:any) => response.Data as Evaluacion)
    )
    .subscribe({
      next: (data:Evaluacion) => {
        this.setEvaluacion(data);
      },
      error: (error: any) => {
        this.popUpManager.showErrorAlert('Error al obtener la evaluación');
      }
    })
  }




}
