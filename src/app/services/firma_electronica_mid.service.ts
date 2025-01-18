import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { RequestManager } from '../managers/requestManager';
import { SolicituDeFirma } from './../models/certificado-pago.model';
import { PopUpManager } from './../managers/popUpManager';
import { DecodedToken } from '../models/decode_token';
import { UserService } from './user.services';
import Swal from 'sweetalert2';
import { CumplidosProveedoresCrudService } from './cumplidos_proveedores_crud.service';
import { CumplidosProveedoresMidService } from './cumplidos_proveedores_mid.service';
import { ModalVisualizarSoporteComponent } from '../components/general-components/modal-visualizar-soporte/modal-visualizar-soporte.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalListarCumplidosComponent } from '../components/supervisor/modal-listar-cumplidos/modal-listar-cumplidos.component';
import { Router } from '@angular/router';
import { Button } from 'src/app/models/button.model';
import { SoportesService } from './soportes.service';
import { InformacionSoporteCumplido } from '../models/revision_cumplidos_proveedores_mid/informacion_soporte_cumplido.model';
import { GestorDocumental } from '../models/gestor_documnental/gestor_ducumental';
import { PeticionFirmaElectronicaEvaluacion } from '../models/evaluacion_cumplido_prov_mid/peticion_firma_electronica_evaluacion';
import { EvaluacionCumplidoProvMidService } from './evaluacion_cumplido_prov_mid';
import { RespuestaFirmaElectronica } from '../models/evaluacion_cumplido_prov_mid/respuesta_firma_electronica';

const httpOptions = {
  headers: new HttpHeaders({
    Accept: 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class FirmaElectronicaService {
  decode_token!: DecodedToken;
  cargarCumplidos: boolean = false;
  recargarTaba!: Function;
  soportes!: InformacionSoporteCumplido[];
  soporteDeSatisfacion!: InformacionSoporteCumplido;
  documentoEvaluacion!: GestorDocumental;
  evaluacionFirmada!: RespuestaFirmaElectronica;

  constructor(
    private requestManager: RequestManager,
    private popUpManager: PopUpManager,
    private userService: UserService,
    private cumplidos_provedore_crud_service: CumplidosProveedoresCrudService,
    private cumplidos_provedore_mid_service: CumplidosProveedoresMidService,
    private evaluacionCumplidoProvMidService: EvaluacionCumplidoProvMidService,
    public dialog: MatDialog,
    private router: Router,
    private soporteService: SoportesService
  ) {
    this.decode_token = this.userService.getPayload();
    this.requestManager.setPath('FIRMA_ELECTRONICA_MID');
  }

  post(endpoint: any, element: any) {
    this.requestManager.setPath('FIRMA_ELECTRONICA_MID');
    return this.requestManager.post(endpoint, element);
  }

  async firmarDocumento(
    solicituDeFirma: SolicituDeFirma,
    idCumplido: number,
    tipoDocumneto: number,
    cargarCumplidos: boolean,
    funcion?: () => void
  ) {
    const fimar = await this.remplazarInformeDeSatisfacion(idCumplido, tipoDocumneto==157);
    if (fimar) {
      if (funcion != undefined) {
        this.recargarTaba = funcion;
      }
      this.cargarCumplidos = cargarCumplidos;
      const confirm = await this.popUpManager.showConfirmAlert(
        '¿Estás seguro de firmar el documento?',
        'Una vez firmado, el documento se cargará automáticamente.'
      );
      if (confirm.isConfirmed) {
        const documentosAFirmarArray = [
          {
            IdTipoDocumento: tipoDocumneto,
            nombre: solicituDeFirma.NombreArchivo,
            metadatos: {
              observaciones: `Cumplido a Satisfaccion ${solicituDeFirma.NombreArchivo}`,
            },
            firmantes: [
              {
                nombre: solicituDeFirma.NombreResponsable,
                cargo: 'Supervisor',
                tipoId: this.decode_token?.documento_compuesto.replace(
                  /[^A-Za-z]/g,
                  ''
                ),
                identificacion: this.decode_token?.documento,
              },
            ],
            representantes: [],
            descripcion: solicituDeFirma.DescripcionDocumento,
            file: solicituDeFirma.Archivo,
          },
        ];

        this.popUpManager.showLoadingAlert(
          'Firmando',
          'Por favor, espera mientras se firma el documento.'
        );

        this.post('/firma_electronica', documentosAFirmarArray).subscribe(
          (response: any) => {
            if (response && response.res) {
              Swal.close();
              //this.aprobarContratacion();
              this.registarSoportePagoFirmado(response.res, idCumplido);
            }
          },
          (error) => {
            Swal.close();
            this.popUpManager.showErrorAlert(
              'No se pudo firmar el documetno , intenta de nuevo'
            );
          }
        );
      } else {
        this.popUpManager.showErrorAlert('Cancelado');
      }
    }
  }

  async buscarSoporteFirmado(idDocumento: number, idCumplido: number) {
    try {
      const response: any = await this.cumplidos_provedore_mid_service
        .get(`/solicitud-pago/soportes/${idCumplido}`)
        .toPromise();

      const documentoFiltrado = response.Data.find(
        (item: any) => item.Documento.Id === idDocumento
      );

      if (documentoFiltrado) {
        if (this.dialog) {
          this.dialog.closeAll();
        }
        Swal.close();
        if (this.recargarTaba != undefined) {
          this.recargarTaba();
        }
        this.openVerSoporte(idCumplido, documentoFiltrado.Archivo.File);
      }
    } catch (error) {
      
    }
  }

  async remplazarInformeDeSatisfacion(cumplido: number,InformeDeSatisfacion:boolean): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if(InformeDeSatisfacion){
        
      this.soporteService.getDocumentosCumplidos(cumplido).subscribe({
        next: async (soportes: InformacionSoporteCumplido[]) => {
          this.soportes = soportes;
          const informe = this.soportes.find(
            (doc) => doc.Documento.CodigoAbreviacionTipoDocumento === 'CS'
          );

          if (informe) {
            const confirm = await this.popUpManager.showConfirmAlert(
              'Ya hay un cumplido a satisfacción',
              '¿Deseas reemplazarlo?'
            );

            if (confirm.isConfirmed) {
              this.soporteDeSatisfacion = informe;
              try {
                this.cumplidos_provedore_crud_service
                  .delete(
                    `/soporte_cumplido`,
                    this.soporteDeSatisfacion.SoporteCumplidoId
                  )
                  .subscribe({
                    next: (response: any) => {
                    },
                    error: (error) => {
                    },
                    complete: () => {
                    },
                  });
                resolve(true);
              } catch (error) {
                reject(false);
              }
            } else {
              resolve(false);
            }
          } else {
            resolve(true);
          }
        },
        error: (error: any) => {
          resolve(true);
        },
      });
    
      }else{resolve(true)}
    });
  }

  registarSoportePagoFirmado(respuesta: any, idCumplido: number) {
    this.popUpManager.showLoadingAlert(
      'Cargando',
      'Por favor, espera mientras se carga el documento.'
    );
    const documento = {
      DocumentoId: respuesta.Id,
      CumplidoProveedorId: { id: idCumplido },
    };
    this.cumplidos_provedore_crud_service
      .post('/soporte_cumplido', documento)
      .subscribe(
        (response) => {
          this.buscarSoporteFirmado(respuesta.Id, idCumplido);
        },
        (error) => {
          //console.error('Error al registrar soporte de pago:', error);
          Swal.close();
          this.popUpManager.showConfirmAlert('Error al registrar el soporte.');
        }
      );
  }

  openVerSoporte(idCumplido: number, documento: string) {
    let bunttonCargarCumplidos: Button | undefined;
    if (this.cargarCumplidos) {
      bunttonCargarCumplidos = {
        Color: 'red',
        TextColor: '',
        Function: () => {
          dialog.close();
          this.router.navigate(['/supervisor/subir-soportes']).then(() => {
            this.dialog.open(ModalListarCumplidosComponent, {
              disableClose: true,
              height: 'auto',
              width: 'auto',
              maxWidth: '60vw',
              maxHeight: '80vh',
              panelClass: 'custom-dialog-container',
            });
          });
        },
        Classes: '',
        Text: 'cerar',
      };
    }

    const dialog = this.dialog.open(ModalVisualizarSoporteComponent, {
      disableClose: true,
      height: 'auto',
      width: 'auto',
      maxWidth: '60vw',
      maxHeight: '80vh',
      panelClass: 'custom-dialog-container',
      data: {
        aprobarSoportes: false,
        idCumplido: idCumplido,
        tipoDocumento: 168,
        url: documento,
        regresarACargaDocumentos: this.registarSoportePagoFirmado,
        BunttonClose: bunttonCargarCumplidos,
      },
    });
    dialog.afterClosed().subscribe();
  }




  FirmarEvaluacion(peticionFirmaEvaluacion:PeticionFirmaElectronicaEvaluacion):Promise<RespuestaFirmaElectronica>{
      this.popUpManager.showLoadingAlert('Firmando Evaluación', 'Por favor, espera mientras se firma la evaluación.');
    return new Promise((resolve, reject) => {
      this.evaluacionCumplidoProvMidService.post('/firma_electronica/firmar_evaluacion', peticionFirmaEvaluacion).subscribe({
        next: (res: any) => {
       if(res && res.Data){
        
        this.evaluacionFirmada = res.Data;
        resolve(this.evaluacionFirmada);
        
       }else{
        Swal.close();
        this.popUpManager.showErrorAlert(res.Message);
       }
        },error:(err)=>{
          Swal.close();
          this.popUpManager.showErrorAlert('Error al firmar la evaluación');
          reject(err);
        }
      })
    });



  }
}
