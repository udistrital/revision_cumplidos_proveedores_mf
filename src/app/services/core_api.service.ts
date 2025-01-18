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

export class CoreApiService {

  constructor(private requestManager: RequestManager) {
    this.requestManager.setPath('CORE_AMAZON_CRUD');
  }

  get(endpoint: string) {
    this.requestManager.setPath('CORE_AMAZON_CRUD');
    return this.requestManager.get(endpoint);
  }

}