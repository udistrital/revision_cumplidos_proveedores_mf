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

  export class DocumentosCrudService {
  
    constructor(private requestManager: RequestManager) {
      this.requestManager.setPath('DOCUMENTOS_CRUD');
    }
  
    get(endpoint: string) {
      this.requestManager.setPath('DOCUMENTOS_CRUD');
      //console.log((environment as any)["DOCUMENTOS_CRUD"]+endpoint);
      return this.requestManager.get(endpoint);
    }
  
  }