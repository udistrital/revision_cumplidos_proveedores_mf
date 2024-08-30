
import { Injectable } from '@angular/core';
import { CumplidosProveedoresCrudService } from './cumplidos_proveedores_crud.service';
import { CumplidosProveedoresMidService } from './cumplidos_proveedores_mid.service';
import { CambioEstado } from '../models/cambio-estado.model';
import { catchError, map, Observable, of } from 'rxjs';
import { AletManagerService } from '../managers/alert-manager.service';

@Injectable({
  providedIn: 'root',
})


export class CambioEstadoService{

    constructor(private alertService: AletManagerService,private cumplidos_provedore_mid_service:CumplidosProveedoresMidService,private cumplidos_provedore_crud_service:CumplidosProveedoresCrudService){

        }

  public getPayload(): any {
    var payload: any = {};
    const idToken = window.localStorage.getItem('id_token')?.split('.');
    if (idToken != undefined) {
      payload = JSON.parse(atob(idToken[1]));
    }
    return payload;
  }

  obtenerEstadoId(codigoAbreviacion: string): Observable<number | null> {
    console.log("codigoAbreviacion:" ,codigoAbreviacion, "id");
    return this.cumplidos_provedore_crud_service
      .get(
        `/estado_cumplido?query=CodigoAbreviacion:${codigoAbreviacion}`
      )
      .pipe(
        map((response: any) => {
          if (response.Data != null && response.Data.length > 0) {
       
            return response.Data[0].Id;
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
     
            console.log(estadoCumplido)
        const idEstado = await this.obtenerEstadoId(estadoCumplido).toPromise();
        console.log("Estado",idEstado)

        if (idEstado === undefined ||idEstado === null ) {
          throw new Error('El ID obtenido es nulo o indefinido.');
        } 

        const cambioEstado = new CambioEstado(
          idEstado,
          idCumplido,
          documentoResponsable,
          cargoResponable
        );
        this.solicituCambiarEstado(cambioEstado);
     
    } catch (error) {
      this.alertService.showCancelAlert(
        'Cancelado',
        'No se pudo relizar la accion' + error
      );
    }
  }


  

  
}

