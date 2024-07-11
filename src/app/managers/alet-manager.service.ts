import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AletManagerService {

  constructor() { }


alertConfirm(tile:string): Promise<any>{

    return Swal.fire({
    title: tile,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar",
    reverseButtons: true
  });


}

showSuccessAlert(title:string,message: string) {
  Swal.fire({
    icon: 'success',
    title: title,
    text: message,
    confirmButtonText:"Aceptar",
  });
}

showCancelAlert(title: string,message: string) {
  Swal.fire({
    icon: 'error',
    title: title,
    text: message,
    confirmButtonText:"Aceptar",
  });
}

}
