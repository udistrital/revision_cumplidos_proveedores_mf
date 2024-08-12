import { Injectable } from '@angular/core';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { Soporte } from 'src/app/models/soporte.model';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SoportesServicesService {



  constructor(
    private cumplidosMidServices: CumplidosProveedoresMidService,
    private popUpManager: PopUpManager,
  ) { }

  getDocumentosCumplidos(cumplido_proveedor: number): Observable<Soporte[]> {
    return this.cumplidosMidServices.get('/solicitud-pago/soportes/' + cumplido_proveedor).pipe(
      map((res: any) => {
        return res.Data.map((soporte: any) => {
          return {
            Id: soporte.Documento.Id,
            nombre: soporte.Documento.Nombre,
            fecha: this.formatearFecha(soporte.Documento.FechaCreacion),
            item: soporte.Documento.TipoDocumento,
            comentario: soporte.Documento.Observaciones,
            archivo: soporte.Archivo.File
          } as Soporte;
        });
      }),
      catchError((error: any) => {
        this.popUpManager.showErrorAlert('No fue posible obtener los documentos del cumplido');
        throw error;
      })
    );
  }

  formatearFecha(date: string){
    const [datePart, timePart, timeZone1, timeZone2] = date.split(' ');
    const [time, milliseconds] = timePart.split('.');

    // Combinar la fecha y la hora en el formato ISO
    const isoString = `${datePart}T${time}.${milliseconds}Z`;

    // Crear un objeto Date
    const dateObject = new Date(isoString);

    // Extraer las partes de la fecha
    const year = dateObject.getUTCFullYear();
    const month = String(dateObject.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getUTCDate()).padStart(2, '0');
    const hours = String(dateObject.getUTCHours()).padStart(2, '0');
    const minutes = String(dateObject.getUTCMinutes()).padStart(2, '0');
    const seconds = String(dateObject.getUTCSeconds()).padStart(2, '0');

    // Combinar todo en el formato deseado
    const formattedDate = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}.${milliseconds} ${timeZone1} ${timeZone2}`;

    return formattedDate
  }
}
