import { Component, OnInit, ViewChild } from '@angular/core';
import { AletManagerService } from 'src/app/managers/alet-manager.service';
import { MatDialog } from '@angular/material/dialog';

import { Cumplido } from 'src/app/models/cumplido';
import { SoporteCumplido } from 'src/app/models/soporte_cumplido';
import { catchError, map, Observable, of } from 'rxjs';
import { CambioEstado } from 'src/app/models/cambio-estado';
import { AutorizacioPago } from 'src/app/models/autorizacion-de-pago';
import { ModalListarSoportes } from 'src/app/components/modal-listar-soportes/modal-listar-soportes.component';
import { GeneralService } from 'src/app/services/generalService.service';
import { ModalVerSoporteComponent } from 'src/app/components/modal-ver-soporte/modal-ver-soporte.component';

@Component({
  selector: 'app-tabla-aproabacion-pago',
  templateUrl: './tabla-aproabacion-pago.component.html',
  styleUrls: ['./tabla-aproabacion-pago.component.css'],
})
export class TablaAproabacionPagoComponent implements OnInit {
  solicitudes: Cumplido[] = [];
  soporte_cumplido: SoporteCumplido[] = [];

  constructor(
    private alertService: AletManagerService,
    public dialog: MatDialog,
    private ordenadorService: GeneralService
  ) {}
  ngOnInit(): void {
    this.CargarTablaCumplidos();
  }
  displayedColumns = [
    'numeroContrato',
    'vigencia',
    'rp',
    'vigenciaRp',
    'fechaCreacion',
    'nombreProveedor',
    'dependencia',
    'acciones',
  ];

  CargarTablaCumplidos() {
    this.solicitudes = [];

    this.ordenadorService.get('/ordenador/solicitudes-pago/52622477').subscribe(
      (response: any) => {
        if (response.Data != null && response.Data.length > 0) {
          this.solicitudes = response.Data;
        } else {
          this.solicitudes = [];
        }
      },
      (error) => {
        console.log('error', error);
        this.solicitudes = [];
      }
    );
  }

  ListarSoportes(idCumplido: number) {
    this.ordenadorService.get('/solicitud-pago/soportes/' + idCumplido).subscribe(
      (response: any) => {
        if (response.Data.length > 0) {
          this.soporte_cumplido = response.Data;
          this.dialog.open(ModalListarSoportes, {
            disableClose: true,
            maxHeight: '80vw',
            maxWidth: '100vw',
            height: '80vh',
            width: '50%',
            data: { soporteCumplido: this.soporte_cumplido,
              idCumplido: idCumplido
             },
          });
        }
      },
      (error) => {
        console.log('error', error);
      }
    );
  }

  async verAutorizacionDePago(idCumplido: number) {

    const autorizacionPago = await this.GenerarAutotizacionDePago(
      idCumplido
    ).toPromise()
    if (autorizacionPago != null) {
      this.openVerSoporte(autorizacionPago.toString(), idCumplido);
    }
  }

  async aprobarSoporte(idCumplido: number, autorizacionPago: string) {
    try {
      let x = await this.alertService.alertConfirm(
        '¿Esta seguro de aprobar los soportes?'
      );

      if (x.isConfirmed) {
        const idEstado = await this.ObtenerEstadoId('AO').toPromise();

        if (idEstado === null || idEstado === undefined) {
          throw new Error('El ID obtenido es nulo o indefinido.');
        } else {
          if (autorizacionPago != null) {
            const autorizacionDePago = new AutorizacioPago(
              idCumplido,
              'application/pdf',
              168,
              'Se aprueba pago desde contratacion',
              'Autorizacion de pago',
              autorizacionPago.toString()
            );
            const cambioEstado = new CambioEstado(
              idEstado,
              idCumplido,
              '52622477',
              'Contratacion'
            );

            this.cargarAutotizacionDePago(autorizacionDePago);
            this.CambiarEstado(cambioEstado);
          }

          this.CargarTablaCumplidos();
          this.alertService.showSuccessAlert(
            'Aprobado',
            '!Se han aprobado los soportes!'
          );
        }
      } else {
        this.alertService.showCancelAlert(
          'Cancelado',
          'No se han aprobado los soportes!'
        );
      }
    } catch (error) {
      this.alertService.showCancelAlert(
        'Cancelado',
        'No se pudo relizar la accion' + error
      );
    }
  }

  async rechazarSoportes(idCumplido: number) {
    let x = await this.alertService.alertConfirm(
      '¿Esta seguro de Rechazar los soportes?'
    );

    if (x.isConfirmed) {
      const id = await this.ObtenerEstadoId('RO').toPromise();

      if (id === null || id === undefined) {
        throw new Error('El ID obtenido es nulo o indefinido.');
      }
      const cambioEstado = new CambioEstado(
        id,
        idCumplido,
        '111111',
        'Contratacion'
      );

      this.CambiarEstado(cambioEstado);
      this.alertService.showSuccessAlert(
        'Rechadado',
        '!Se han rechazado los soprtes!'
      );
    } else {
      this.alertService.showCancelAlert(
        'Cancelado',
        'No se han rechazado los soprtes'
      );
    }
  }

  CambiarEstado(cambioEstado: CambioEstado) {
    this.ordenadorService
      .post('/solicitud-pago/cambio-estado', cambioEstado)
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  ObtenerEstadoId(codigoAbreviacion: string): Observable<number | null> {
    return this.ordenadorService
      .getCumplidosProveedoresCrud(
        `/estado_cumplido?query=CodigoAbreviación:${codigoAbreviacion}`
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

  GenerarAutotizacionDePago(cumplidoId: number): Observable<number | null> {
  
    return this.ordenadorService
      .get('/ordenador/certificado-aprobacion-pago/' + cumplidoId)
      .pipe(
        map((response: any) => {
          if (response.Data != null) {
        
            return response.Data.Archivo;
          }
          return null;
        }),
        catchError((error) => {
          console.error('Error', error);
          return of(null);
        })
      );
  }

  cargarAutotizacionDePago(autorizacionPago: AutorizacioPago) {
    this.ordenadorService
      .post(`solicitud-pago/soportes`, autorizacionPago)
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  openVerSoporte(pdfBase64: string, idCumplido: number) {
    this.dialog.open(ModalVerSoporteComponent, {
      disableClose: true,
      height: '70vh',
      width: '40vw',
      maxWidth: '60vw',
      maxHeight: '80vh',
      panelClass: 'custom-dialog-container',
      data: {
        base64: pdfBase64,
        aprobarSoportes: true,
        idCumplido: idCumplido,
        funcionAprobar: (id: number, base64: string) =>
          this.aprobarSoporte(id, base64),
      },
    });
  }
}
