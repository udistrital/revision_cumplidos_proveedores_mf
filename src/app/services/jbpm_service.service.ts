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

export class JbpmService {

  constructor(private requestManager: RequestManager) {
    this.requestManager.setPath('JBPM');
  }

  get(endpoint: string) {
    this.requestManager.setPath('JBPM');
    return this.requestManager.get(endpoint);
  }

}