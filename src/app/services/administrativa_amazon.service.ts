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

export class AdministrativaAmazonService {

  constructor(private requestManager: RequestManager) {
    this.requestManager.setPath('ADMINISTRATIVA_AMAZON_API');
  }

  get(endpoint: string) {
    this.requestManager.setPath('ADMINISTRATIVA_AMAZON_API');
    return this.requestManager.get(endpoint);
  }



}