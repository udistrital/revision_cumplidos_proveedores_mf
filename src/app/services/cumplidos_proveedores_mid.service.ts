import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { RequestManager } from '../managers/requestManager';
import { BehaviorSubject } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
      'Accept': 'application/json',
  }),
}

@Injectable({
  providedIn: 'root',
})

export class CumplidosProveedoresMidService {

  private contratoSubject = new BehaviorSubject<any>(null);
  contrato$ = this.contratoSubject.asObservable();

  private cumplidoSubject = new BehaviorSubject<any>(null);
  cumplido$ = this.cumplidoSubject.asObservable()

  constructor(private requestManager: RequestManager) {
    this.requestManager.setPath('CUMPLIDOS_PROVEEDORES_MID_SERVICE');
  }

  get(endpoint: string) {
    this.requestManager.setPath('CUMPLIDOS_PROVEEDORES_MID_SERVICE');
    return this.requestManager.get(endpoint);
  }

  post(endpoint: any, element: any) {
    this.requestManager.setPath('CUMPLIDOS_PROVEEDORES_MID_SERVICE');
    return this.requestManager.post(endpoint, element);
  }

  put(endpoint: any, element: any) {
    this.requestManager.setPath('CUMPLIDOS_PROVEEDORES_MID_SERVICE');
    return this.requestManager.put(endpoint, element);
  }

  delete(endpoint: any, element: any) {
    this.requestManager.setPath('CUMPLIDOS_PROVEEDORES_MID_SERVICE');
    return this.requestManager.delete(endpoint, element.Id);
  }

  getContrato(contrato: any) {
    this.contratoSubject.next(contrato);
  }

  getCumplidoProveedor(cumplido: any){
    this.cumplidoSubject.next(cumplido);
  }
}
