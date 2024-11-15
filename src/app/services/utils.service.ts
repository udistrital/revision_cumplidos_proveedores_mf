import { Injectable } from '@angular/core';
import { CumplidosProveedoresMidService } from './cumplidos_proveedores_mid.service';
import { PopUpManager } from '../managers/popUpManager';
import { Documento } from '../models/revision_cumplidos_proveedores_mid/informacion_soporte_cumplido.model';
import { AdministrativaAmazonService } from './administrativa_amazon.service';
import { UnidadMedida } from '../models/unidad-medida';
import { Month } from '../models/month.model';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private documentos!:Documento[]
  constructor(private cumplidosMidServices: CumplidosProveedoresMidService,private popUpManager:PopUpManager,private administrativaAmazonService:AdministrativaAmazonService) {}

  base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  formatearFecha(date: string) {
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

    return formattedDate;
  }

  obternerAnios(): number[] {
    const anioInico = 2017;
    const anioActual = new Date().getFullYear();
    const anios: number[] = [];
    for (let anio = anioInico; anio <= anioActual; anio++) {
      anios.push(anio);
    }

    return anios;
  }

  async obtenerIdDocumento(abreviacion: string): Promise<number | null> {
    console.log(abreviacion);
  
    return new Promise((resolve, reject) => {
      this.cumplidosMidServices
        .get('/supervisor/tipos-documentos-cumplido')
        .subscribe({
          next: (res: any) => {
            this.documentos = res.Data;
  
            const documento = this.documentos.find(doc => doc.CodigoAbreviacionTipoDocumento === abreviacion);
            if (!documento) {
              //console.warn('No se encontró un documento con la abreviación:', abreviacion);
              return resolve(null);
            }
  
            resolve(documento.IdTipoDocumento ?? null);
          },
          error: (error: any) => {
            this.popUpManager.showErrorAlert(
              'No fue posible obtener los documentos que se pueden subir en el cumplido.'
            );
            reject(error);
          },
        });
    });
  }
  
}
