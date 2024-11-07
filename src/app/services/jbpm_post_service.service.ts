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

export class JbpmServicePost {

  constructor(private requestManager: RequestManager) {
    this.requestManager.setPath('JBPMPOST');
  }

  get(endpoint: string) {
    //console.log(endpoint)
    this.requestManager.setPath('JBPMPOST');
    return this.requestManager.get(endpoint);
  }
  post(endpoint: any, element: any) {
    this.requestManager.setPath('JBPMPOST');
    return this.requestManager.post(endpoint, element);
  }
}