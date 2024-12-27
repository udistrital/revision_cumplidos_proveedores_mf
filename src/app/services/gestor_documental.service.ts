import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { RequestManager } from '../managers/requestManager';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
      'Accept': 'application/json',
  }),
}

@Injectable({
  providedIn: 'root',
})

  export class GestorDocumentalService {
  
    constructor(private requestManager: RequestManager) {
      this.requestManager.setPath('GESTOR_DOCUMENTAL_MID');
    }
  
    get(endpoint: string) {
      this.requestManager.setPath('GESTOR_DOCUMENTAL_MID');
     
      return this.requestManager.get(endpoint);
    }
  
  }