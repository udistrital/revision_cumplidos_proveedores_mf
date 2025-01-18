import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';

import { ModalHistoricoComponent } from '../modal-historico/modal-historico.component';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { Cumplido } from 'src/app/models/cumplido';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { EstadoCumplido } from 'src/app/models/cambio_estado';
import {
  Documento,
  InformacionSoporteCumplido,
} from 'src/app/models/revision_cumplidos_proveedores_mid/informacion_soporte_cumplido.model';
import {
  DocumentoHistorico,
  SoporteEstados,
} from 'src/app/models/documento_historico';
import { Archivo } from './../../../models/revision_cumplidos_proveedores_mid/informacion_soporte_cumplido.model';
import { SoporteCumplido } from 'src/app/models/revision_cumplidos_proveedores_crud/soporte-cumplido.model';
import { ModalVisualizarSoporteComponent } from '../../general-components/modal-visualizar-soporte/modal-visualizar-soporte.component';
import {
  Mode,
  RolUsuario,
} from 'src/app/models/modal-soporte-cumplido-data.model';

@Component({
  selector: 'app-listado-historicos',
  templateUrl: './listado-historicos.component.html',
  styleUrls: ['./listado-historicos.component.css'],
})
export class ListadoHistoricosComponent implements OnInit {
  @Input() displayedColumns: any[] = [];
  @Input() dataSource!: Cumplido[];
  listaCambiosEstados: EstadoCumplido[] = [];
  listaDocumentosCargados: InformacionSoporteCumplido[] = [];
  file!: Archivo;

  constructor(
    private popUpManager: PopUpManager,
    private dialog: MatDialog,
    private cumplidosMidService: CumplidosProveedoresMidService
  ) { }

  ngOnInit(): void { }

  async descargarArchivoComprimido(element: any): Promise<Archivo | any> {
    const confirm = await this.popUpManager.showConfirmAlert(
      'Vas a descargar los documentos. Puede tomar unos momentos.',
      '¿Estás seguro?'
    );

    if (confirm.isConfirmed) {
      this.popUpManager.showLoadingAlert('Descargando...');

      return new Promise((resolve, reject) => {
        this.cumplidosMidService
          .get(`/solicitud-pago/soportes-comprimido/${element.IdCumplido}`)
          .subscribe({
            next: (response: any) => {
              if (response.Data != null) {
                this.file = {
                  Nombre: response.Data.nombre,
                  File: response.Data.file,
                };

                const byteCharacters = atob(this.file.File);
                const byteNumbers = new Uint8Array(byteCharacters.length);

                for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                }

                const blob = new Blob([byteNumbers], {
                  type: 'application/zip',
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = this.file.Nombre + '.zip';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                resolve(this.file);
              } else {
                this.popUpManager.showErrorAlert('No hay archivos para descargar.');
                resolve(null);
              }
              Swal.close();
            },
            error: (error: any) => {
              this.popUpManager.showErrorAlert('Error al descargar.');
              reject(error);
              Swal.close();
            },
          });
      });
    } else {
      return null;
    }
  }

  async abrirModalHistorico(element: any) {
    await this.cargarCambiosDeEstado(element.IdCumplido);
    await this.cargarDocumentosCargados(element.IdCumplido);
    this.dialog.open(ModalHistoricoComponent, {
      disableClose: true,
      height: '70vh',
      width: '100vw',
      maxWidth: '60vw',
      maxHeight: '80vh',
      panelClass: 'container-historico',
      data: {
        listaEstadosCumplidos: this.listaCambiosEstados,
        listaDocumentosCargados: this.listaDocumentosCargados,
        Buttons: [
          {
            Color: 'white',
            FontIcon: 'visibility',
            Function: (file: any) => {
              const visualizarSoporetes = this.dialog.open(
                ModalVisualizarSoporteComponent,
                {
                  disableClose: true,
                  height: 'auto',
                  width: 'auto',
                  maxWidth: '60vw',
                  maxHeight: '80vh',
                  panelClass: 'custom-dialog-container',
                  data: {
                    url: file.Archivo.File,
                  },
                }
              );
            },
            Classes: 'ver-documentos-button',
            Text: 'Ver',
          },
        ],
        Config: {
          mode: Mode.AO,
          rolUsuario: RolUsuario.C,
        },
      },
    });
  }

  async cargarCambiosDeEstado(idCumplido: number): Promise<EstadoCumplido[]> {
    this.popUpManager.showLoadingAlert('Cargando...');
    return new Promise((resolve, reject) => {
      this.cumplidosMidService
        .get('/historico-cumplidos/historico_cumplido/' + idCumplido)
        .subscribe({
          next: (response: any) => {
            if (response.Data) {
              this.listaCambiosEstados = response.Data.map(
                (estado: EstadoCumplido) => ({
                  nombreResponsable: estado.nombreResponsable,
                  estado: estado.estado,
                  fecha: estado.fecha,
                  cargo: estado.cargo,
                })
              );
              resolve(this.listaCambiosEstados);
              Swal.close();
            } else {
              resolve([]);
            }
          },
          error: (err: any) => {
            this.popUpManager.showErrorAlert(
              'Error al consultar el histórico de estados.'
            );
            reject(err);
          },
        });
    });
  }

  async cargarDocumentosCargados(
    idCumplido: number
  ): Promise<InformacionSoporteCumplido[]> {
    return new Promise((resolve, reject) => {
      this.popUpManager.showLoadingAlert('Cargando...');
      this.cumplidosMidService
        .get('/solicitud-pago/soportes/' + idCumplido)
        .subscribe({
          next: (response: any) => {
            if (response.Data) {
              this.listaDocumentosCargados = response.Data.map(
                (documento: InformacionSoporteCumplido) => ({
                  SoporteCumplidoId: documento.SoporteCumplidoId,
                  Documento: {
                    IdTipoDocumento: documento.Documento.IdTipoDocumento,
                    Id: documento.Documento.Id,
                    Nombre: documento.Documento.Nombre,
                    TipoDocumento: documento.Documento.TipoDocumento,
                    Descripcion: documento.Documento.Descripcion,
                    Observaciones: documento.Documento.Observaciones,
                    FechaCreacion: documento.Documento.FechaCreacion,
                    CodigoAbreviacionTipoDocumento:
                      documento.Documento.CodigoAbreviacionTipoDocumento,
                  },
                  Archivo: {
                    File: documento.Archivo.File,
                  },
                  Comentarios: {},
                })
              );
              resolve(this.listaDocumentosCargados);
              Swal.close();
            } else {
              Swal.close();
              resolve([]);
            }
          },
          error: (err: any) => {
            this.popUpManager.showErrorAlert(
              'Error al consultar el histórico de documentos.'
            );
            reject(err);
          },
        });
    });
  }

  handleActionClick(event: { action: any; element: any }) {
    if (event.action.actionName === 'visibility') {
      this.abrirModalHistorico(event.element);
    } else if (event.action.actionName === 'archive') {
      this.descargarArchivoComprimido(event.element);
    }
  }
}
