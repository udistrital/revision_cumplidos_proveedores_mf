import { Component } from '@angular/core';
import { AletManagerService } from 'src/app/managers/alet-manager.service';
import { MatDialog } from '@angular/material/dialog';
import { GeneralService } from 'src/app/services/generalService.service';
import { Cumplido } from 'src/app/models/cumplido';
import { SoporteCumplido } from 'src/app/models/soporte_cumplido';
import { catchError, map, Observable, of } from 'rxjs';
import { CambioEstado } from 'src/app/models/cambio-estado';
import { ModalListarSoportes } from 'src/app/components/modal-listar-soportes/modal-listar-soportes.component';

@Component({
  selector: 'app-tabla-aprobacion-pago-contratacion',
  templateUrl: './tabla-aprobacion-pago.component.html',
  styleUrls: ['./tabla-aprobacion-pago.component.css'],
})
export class TablaAprobacionPagoComponent {
  solicitudes: Cumplido[] = [];
  soporte_cumplido: SoporteCumplido[] = [];

  constructor(
    private alertService: AletManagerService,
    public dialog: MatDialog,
    private contratacionService: GeneralService
  ) {
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

    this.contratacionService.get('/contratacion/solicitudes-pago/').subscribe(
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

  ListarSoportes(id: number) {
    this.contratacionService.get('/solicitud-pago/soportes/' + id).subscribe(
      (response: any) => {
        if (response.Data.length > 0) {
          this.soporte_cumplido = response.Data;
          this.dialog.open(ModalListarSoportes, {
            disableClose: true,
            height: '70vh',
            width: '40vw',
            maxWidth: '60vw',
            maxHeight: '80vh',
            panelClass: 'custom-dialog-container',
            data: { soporteCumplido: this.soporte_cumplido },
          });
        }
      },
      (error) => {
        console.log('error', error);
      }
    );
  }

  async aprobarSoportes(idCumplido: number) {
    let x = await this.alertService.alertConfirm(
      '¿Esta seguro de aprobar los soportes?'
    );
    console.log(idCumplido);
    if (x.isConfirmed) {
      try{

      const idEstado = await this.ObtenerEstadoId('PRO').toPromise();
      const tipo_documento = await this.ObternerIdTipoDocumento(
        'AP'
      ).toPromise();


      if (idEstado === null || idEstado === undefined) {
        throw new Error('El ID obtenido es nulo o indefinido.');
      } else {


          const cambioEstado = new CambioEstado(
            idEstado,
            idCumplido,
            '52622477',
            'Contratacion'
          );
      ///    this.CambiarEstado(cambioEstado);
          this.CargarTablaCumplidos();

      }

      this.alertService.showSuccessAlert('Aprobado', '!se Aprobo con exito!');
      }catch(error){
        this.alertService.showCancelAlert(
          'Cancelado',
          'No se pudo relizar la accion'+error
        );
      }
    } else {
      this.alertService.showCancelAlert(
        'Cancelado',
        'No se pudo relizar la accion'
      );
    }
  }

  async rechazarSoportes(idCumplido: number) {
    let x = await this.alertService.alertConfirm(
      '¿Esta seguro de Rechazar los soportes?'
    );
    if (x.isConfirmed) {
      const id = await this.ObtenerEstadoId('RC').toPromise();
      console.log('log' + id);

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

      this.contratacionService;
      this.alertService.showSuccessAlert(
        'Rehzadado',
        '!Se han rechazado los soprtes!'
      );
    } else {
      this.alertService.showCancelAlert(
        'Cancelado',
        'No se han rechazado los sooprtes'
      );
    }
  }

  CambiarEstado(cambioEstado: CambioEstado) {
    this.contratacionService
      .post('solicitud-pago/cambio-estado', cambioEstado)
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
    return this.contratacionService
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

  ObternerIdTipoDocumento(codigoAbreviacion: string) {
    return this.contratacionService
      .getDocumnetosCrud(
        `tipo_documento/?query=DominioTipoDocumento.CodigoAbreviacion:CUMP_PROV,CodigoAbreviacion:${codigoAbreviacion}`
      )
      .pipe(
        map((response: any) => {
          if (response.Data != null && response.Data.length > 0) {
            console.log(response);
          }
          return null;
        }),
        catchError((error) => {
          console.error('Error', error);
          return of(null);
        })
      );
  }




}
