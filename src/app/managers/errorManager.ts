import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Injectable, forwardRef, Inject, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorManager {
  constructor(private snack: MatSnackBar) {}

  public handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      //console.error('Error del lado del cliente:', error.error.message);
      this.snack.open('Error del cliente. Por favor, verifique su conexión a la red.', 'Cerrar', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    } else {
      // Maneja errores del servidor
      //console.error(
        `Código de estado ${error.status}, ` +
        `cuerpo del error: ${JSON.stringify(error.error)}`
      );
      this.snack.open(this.getErrorMessage(error), 'Cerrar', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    }

    return throwError(() => new Error(this.getErrorMessage(error)));
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 0:
        return 'Error desconocido. Por favor, verifique su conexión a la red.';
      case 400:
        return 'Solicitud incorrecta. Por favor, revise su entrada.';
      case 401:
        return 'No autorizado. Por favor, inicie sesión para acceder a este recurso.';
      case 403:
        return 'Prohibido. No tiene permiso para acceder a este recurso.';
      case 404:
        return 'No encontrado. El recurso solicitado no pudo ser encontrado.';
      case 500:
        return 'Error interno del servidor. Por favor, intente de nuevo más tarde.';
      default:
        return 'Ocurrió un error inesperado. Por favor, intente de nuevo más tarde.';
    }
  }
}