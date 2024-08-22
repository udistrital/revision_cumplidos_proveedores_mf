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

export class FirmaElectronicaService {

    constructor(private requestManager: RequestManager) {
        this.requestManager.setPath('FIRMA_ELECTRONICA_MID');
      }

    post(endpoint:any , element :any){ 
        this.requestManager.setPath('FIRMA_ELECTRONICA_MID');
    return this.requestManager.post(endpoint, element); 

}

}