import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpErrorManager } from './errorManager';

@Injectable({
  providedIn: 'root',
})
export class RequestManager {
  private path!: any;
  public httpOptions: any;

  constructor(
    private http: HttpClient,
    private errorManager: HttpErrorManager
  ) {

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
  }

  public setPath(service: string) {
    this.path = environment[service as keyof typeof environment];
  }
  
  get(endpoint: any) {
    return this.http.get<any>(`${this.path}${endpoint}`, this.httpOptions).pipe(
      map(
        (res) => {
          if (res.hasOwnProperty('Body')) {
            return res;
          } else {
            return res;
          }
        },
      ),
      catchError(this.errorManager.handleError.bind(this)),
    );
  }


  post(endpoint: any, element: any) {
    return this.http.post<any>(`${this.path}${endpoint}`, element, this.httpOptions).pipe(
      catchError(this.errorManager.handleError),
    );
  }

}
