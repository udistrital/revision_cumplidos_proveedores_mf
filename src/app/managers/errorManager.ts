import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Injectable, forwardRef, Inject, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorManager {
  constructor(
    public snack: MatSnackBar,
   ) {}

  public handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
 

      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: `, error.error);
    }

    if(error.status === 200){
      return []
    }else {
      return throwError(error.error);
    }
  };
}