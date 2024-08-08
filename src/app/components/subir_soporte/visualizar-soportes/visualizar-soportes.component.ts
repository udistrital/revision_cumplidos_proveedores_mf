import { Component } from '@angular/core';
import { Soporte } from 'src/app/models/soporte.model';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';



@Component({
  selector: 'app-visualizar-soportes',
  templateUrl: './visualizar-soportes.component.html',
  styleUrls: ['./visualizar-soportes.component.css']
})
export class VisualizarSoportesComponent {

  solicitudPago!: number;
  soportes_cumplidos!:any;
  tittle = 'VER SOPORTES'

  soportes: Soporte[] = []

  constructor(
    private cumplidosMidServices: CumplidosProveedoresMidService,
    private popUpManager: PopUpManager,
  ){

  }

  ngOnInit() {
    this.cumplidosMidServices.cumplido$.subscribe(cumplido => {
      if (cumplido) {
        this.solicitudPago = cumplido.cumplidoProveedor.Id;
      }
    })
    this.getDocumentosCumplidos();
  }

  getDocumentosCumplidos(){
    this.cumplidosMidServices.get('/solicitud-pago/soportes/' + this.solicitudPago)
    .subscribe({
      next: (res: any) => {
        this.soportes_cumplidos = res.Data;
        console.log(this.soportes_cumplidos)
        this.soportes = this.soportes_cumplidos.map((soporte: any) => {
          return {
            nombre: soporte.Documento.Nombre,
            fecha: this.formatearFecha(soporte.Documento.FechaCreacion),
            item: soporte.Documento.TipoDocumento,
            comentario: soporte.Documento.Observaciones,
            archivo: soporte.Archivo.File
          };
        })
      },
      error: (error: any) => {
        this.popUpManager.showErrorAlert('No fue posible obtener los documentos del cumplido')
      }
    })
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
