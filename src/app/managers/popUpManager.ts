import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
// @ts-ignore
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})

export class PopUpManager {
  constructor(
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }

  showToast(message: string, duration: number = 3000) {
    this.translate.get(message).subscribe((translatedMessage: string) => {
      this.snackBar.open(translatedMessage, 'Cerrar', {
        duration: duration,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['success-snackbar']
      });
    });
  }

  showErrorToast(message: string) {
    this.translate.get(message).subscribe((translatedMessage: string) => {
      this.snackBar.open(translatedMessage, 'Cerrar', {
        duration: 5000, // Ejemplo de duración
        panelClass: ['error-snackbar'], // Clase CSS personalizada para el toast de error
      });
    });
  }

  showInfoToast(message: string, duration: number = 3000) {
    this.translate.get(message).subscribe((translatedMessage: string) => {
      this.snackBar.open(translatedMessage, 'Cerrar', {
        duration: duration,
        panelClass: ['info-snackbar'], // Clase CSS personalizada para el toast de información
      });
    });
  }

  showAlert(title: string, text: string) {
    Swal.fire({
      icon: 'info',
      title: title,
      text: text,
      confirmButtonText: this.translate.instant('Aceptar'),
    });
  }

  showLoadingAlert(title: string, message: string): Promise<any> {
    return Swal.fire({
      title: title,
      text: message,
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,
      width: '400px',
    });
  }

  showSuccessAlert(text: string):Promise<any> {
    return Swal.fire({
      icon: 'success',
      title: this.translate.instant('Operación exitosa'),
      text: text,
      confirmButtonText: this.translate.instant('Aceptar'),
    });
  }

  showErrorAlert(text: string) {
    Swal.fire({
      icon: 'error',
      title: this.translate.instant('Error'),
      text: text,
      confirmButtonText: this.translate.instant('Aceptar'),
    });
  }

  showConfirmAlert(text: string, title: string = this.translate.instant('Atención')): Promise<any> {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('Aceptar'),
      cancelButtonText: this.translate.instant('Cancelar'),
      reverseButtons: true,
    });
  }

  showPopUpGeneric(title: string, text: string, type: any, cancelar: any): Promise<any> {
    return Swal.fire({
      title: title,
      html: text,
      icon: type,
      showCancelButton: cancelar,
      allowOutsideClick: !cancelar,
      confirmButtonText: this.translate.instant('Aceptar'),
      cancelButtonText: this.translate.instant('Cancelar'),
    });
  }

  showPopUpForm(title: string, form: { html: string; ids: any[]; }, cancelar: any): Promise<any> {
    return Swal.fire({
      title: title,
      html: form.html,
      showCancelButton: cancelar,
      allowOutsideClick: !cancelar,
      confirmButtonText: this.translate.instant('Aceptar'),
      cancelButtonText: this.translate.instant('Cancelar'),
      preConfirm: () => {
        const results: any = {};
        form.ids.forEach(id => {
          const element = <HTMLInputElement>Swal.getPopup()!.querySelector('#' + id);
          //  results[id] = element.value;
        });
        return results;
      },
    });
  }
}
