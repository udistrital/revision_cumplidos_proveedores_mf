import { Injectable } from '@angular/core';
import { Month } from '../models/month.model';

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

  obternerAnios(): number[] {
    const anioInico = 2017;
    const anioActual = new Date().getFullYear();
    const anios: number[] = [];
    for (let anio = anioInico; anio <= anioActual; anio++) {
      anios.push(anio);
    }

    return anios;
  }


   obtenerMeses=(): Month[] => [
      { nombre: 'Enero', mes: 1 },
      { nombre: 'Febrero', mes: 2 },
      { nombre: 'Marzo', mes: 3 },
      { nombre: 'Abril', mes: 4 },
      { nombre: 'Mayo', mes: 5 },
      { nombre: 'Junio', mes: 6 },
      { nombre: 'Julio', mes: 7 },
      { nombre: 'Agosto', mes: 8 },
      { nombre: 'Septiembre', mes: 9 },
      { nombre: 'Octubre', mes: 10 },
      { nombre: 'Noviembre', mes: 11 },
      { nombre: 'Diciembre', mes: 12 }
    ];
  }

  

