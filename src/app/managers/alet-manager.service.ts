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
    reverseButtons: true,
    confirmButtonColor: '#358227', 
   cancelButtonColor: '#d33',
    width:"400px",
    allowOutsideClick: false,
  
    

  
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

showInfoAlert(title: string, message: string): Promise<any> {
  return Swal.fire({
    icon: 'info',
    title: title,
    text: message,
    confirmButtonText: 'Aceptar',
    width: '400px',
    confirmButtonColor: '#358227',
    allowOutsideClick: false,
  });
}

showSuccessAlert(title:string,message: string) {
  Swal.fire({
    icon: 'success',
    title: title,
    text: message,
    confirmButtonText:"Aceptar",
    width:"400px",
    confirmButtonColor: '#358227', 
    cancelButtonColor: '#d33',
    allowOutsideClick: false,
    
  });
}

showCancelAlert(title: string,message: string) {
  Swal.fire({
    icon: 'error',
    title: title,
    text: message,
    confirmButtonText:"Aceptar",
    width:"400px",
    confirmButtonColor: '#358227', 
    cancelButtonColor: '#d33',
    allowOutsideClick: false,
  });
}

}
