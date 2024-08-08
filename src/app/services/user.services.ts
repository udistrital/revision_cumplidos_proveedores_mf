import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { RequestManager } from '../managers/requestManager';

@Injectable({
  providedIn: 'root',
})


export class UserService{

  public getPayload(): any {
    var payload: any = {};
    const idToken = window.localStorage.getItem('id_token')?.split('.');
    if (idToken != undefined) {
      payload = JSON.parse(atob(idToken[1]));
    }
    return payload;
  }

}

