import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
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
