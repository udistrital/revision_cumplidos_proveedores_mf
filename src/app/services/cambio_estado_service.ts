
import { Injectable } from '@angular/core';
import { CumplidosProveedoresCrudService } from './cumplidos_proveedores_crud.service';
import { CumplidosProveedoresMidService } from './cumplidos_proveedores_mid.service';
import { CambioEstado } from '../models/cambio-estado.model';
import { catchError, map, Observable, of } from 'rxjs';
import { AletManagerService } from '../managers/alert-manager.service';
import { UserService } from './user.services';
import { JbpmService } from './jbpm_service.service';

@Injectable({
  providedIn: 'root',
})


export class CambioEstadoService{

    documentoResponsable:string=""
    asunto:string=""
    documentoDestinatario:string=""


    constructor(private alertService: AletManagerService,private cumplidos_provedore_mid_service:CumplidosProveedoresMidService,private cumplidos_provedore_crud_service:CumplidosProveedoresCrudService, private userService:UserService,private jbpmService:JbpmService){

        }

 

  obtenerEstado(codigoAbreviacion: string): Observable<number | null> {
    return this.cumplidos_provedore_crud_service
      .get(
        `/estado_cumplido?query=CodigoAbreviacion:${codigoAbreviacion}`
      )
      .pipe(
        map((response: any) => {
          if (response.Data != null && response.Data.length > 0) {
       
            return response.Data[0];
          }
          return null;
        }),
        catchError((error) => {
          console.error('Error', error);
          return of(null);
        })
      );
  }




  private solicituCambiarEstado(cambioEstado: CambioEstado) {
    this.cumplidos_provedore_mid_service
      .post('/solicitud-pago/cambio-estado', cambioEstado)
      .subscribe(
        (response) => {
          console.log(cambioEstado)
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }


  async cambiarEstado(idCumplido: number,estadoCumplido:string, documentoResponsable:string,cargoResponable:string) {
    try {
     
        
        const estado:any = await this.obtenerEstado(estadoCumplido).toPromise();
            console.log("Estado desde cambiar: " ,estado)
        if (estado === undefined ||estado === null ) {
          throw new Error('El ID obtenido es nulo o indefinido.');
        } 

        const cambioEstado = new CambioEstado(
          estado.Id,
          idCumplido,
          documentoResponsable,
          cargoResponable
        );
        this.solicituCambiarEstado(cambioEstado);


        await this.obtenerAsunto(estado.CodigoAbreviacion);

         console.log("Essssstadooooo : ",this.asunto)

      /*
        const notificacion = Notification("66c8afeca6ee77849101664d",
            "66ac05deb6d4007375621835",
            ["265313"],
            this.documentoResponsable,
            "asunto: string",
            mensaje: string,
            lectura: boolean,
            {},
            activo: boolean
        ) 
      */
     
    } catch (error) {
      this.alertService.showCancelAlert(
        'Cancelado',
        'No se pudo relizar la accion' + error
      );
    }
  }


  private async  obtenerAsunto(estado:string){
     console.log("obtenerAsunto", estado)
    switch(estado){
        case "PRO":
        this.asunto= "Contratacion te asigno una de cumplidoo proveedor"

        break;
        case "PRC":
          this.asunto= "EL supervisor te asigno una de cumplidoo proveedor"
          break;
        case "AO":
        this.asunto= "El ordenador ha aprobado una solicitud de cumplidoo proveedor"
        break;
        case "RO":
        this.asunto= "EL supervisor te asigno una de cumplidoo proveedor"
        break;
        case "RC":
            this.asunto= "Contratacion  ha rechazado la solicitud  de cumplidoo proveedor"
            break;
            default:
                this.asunto=""
                break;
    }
  }



  


  
}

