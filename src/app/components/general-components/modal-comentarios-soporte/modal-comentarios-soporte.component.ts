import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { InformacionComentarioIndividual } from 'src/app/models/informacion-comentario-individual';
import {
  ModalComentariosSoporteData,
  Mode,
  RolUsuario,
} from 'src/app/models/modal-soporte-cumplido-data.model';
import { CambioEstadoCumplido } from 'src/app/models/revision_cumplidos_proveedores_crud/cambio-estado-cumplio.model';
import { ComentarioSoporte } from 'src/app/models/revision_cumplidos_proveedores_crud/comentario-soporte.model';
import { CumplidosProveedoresCrudService } from 'src/app/services/cumplidos_proveedores_crud.service';

@Component({
  selector: 'app-modal-comentarios-soporte',
  templateUrl: './modal-comentarios-soporte.component.html',
  styleUrls: ['./modal-comentarios-soporte.component.scss'],
})
export class ModalComentariosSoporteComponent implements OnInit {
  comentarios: ComentarioSoporte[] = []; // Inicializamos la lista de comentarios vacía
  informacionComentarioIndividual: InformacionComentarioIndividual[] = [];
  isLoading: boolean = false; // Indicador para saber si estamos cargando los datos
  cambioEstadoCumplido!: CambioEstadoCumplido;
  mode = Mode;
  rolUsuario = RolUsuario;

  constructor(
    public dialogRef: MatDialogRef<ModalComentariosSoporteComponent>,
    private cumplidos_provedore_crud_service: CumplidosProveedoresCrudService,
    private popUpManager: PopUpManager,
    @Inject(MAT_DIALOG_DATA) public data: ModalComentariosSoporteData
  ) {}

  ngOnInit(): void {
    this.ObtenerUltimoCambioEstado();
    this.obtenerComentariosSoporte();
  }

  obtenerComentariosSoporte() {
    if (this.data.SoporteId !== 0) {
      this.isLoading = true;
      this.cumplidos_provedore_crud_service
        .get(
          `/comentario_soporte/?query=SoporteCumplidoId.Id:${this.data.SoporteId}&sortby=FechaCreacion&order=desc`
        )
        .subscribe({
          next: (comentarios) => {
            this.isLoading = false;
            if (comentarios.Data && comentarios.Data.length > 0) {
              this.comentarios = comentarios.Data;
              try {
                this.informacionComentarioIndividual = this.comentarios.map(
                  (comentario: ComentarioSoporte) => {
                    return {
                      Rol: comentario.CambioEstadoCumplidoId.CargoResponsable,
                      Fecha: comentario.FechaModificacion,
                      Comentario: comentario.Comentario,
                    };
                  }
                );
              } catch (error) {
                this.comentarios = [];
                this.informacionComentarioIndividual = [];
                this.isLoading = false;
                if ( this.data.Config.rolUsuario==this.rolUsuario.S){
                  this.dialogRef.close();
                  this.popUpManager.showAlert(
                    'Soporte sin comentarios',
                    'Este soporte no tiene comentarios registrados.'
                  );
                }
              }
            } else {
              this.comentarios = [];
              this.informacionComentarioIndividual = [];
             
              this.isLoading = false;
              if ( this.data.Config.rolUsuario==this.rolUsuario.S){
                this.dialogRef.close();
                this.popUpManager.showAlert(
                  'Soporte sin comentarios',
                  'Este soporte no tiene comentarios registrados.'
                );
              }
            }
          },
          error: () => {
            this.isLoading = false;
            this.comentarios = [];
            this.informacionComentarioIndividual = [];
            this.popUpManager.showErrorAlert(
              'Hubo un error al intentar recuperar los comentarios del soporte.'
            );
          },
        });
    }
  }

  ObtenerUltimoCambioEstado() {
    this.isLoading = true;
    //console.log(this.cambioEstadoCumplido);
    this.cumplidos_provedore_crud_service
      .get(
        `/cambio_estado_cumplido/?query=Activo:true,CumplidoProveedorId.Id:${this.data.CumplidoProveedorId}&sortby=FechaCreacion&order=desc`
      )
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (!response.Success || response.Data.length == 0) {
            //console.log(this.cambioEstadoCumplido);
          }
          this.cambioEstadoCumplido = response.Data[0];
          //console.log(response);
        },
        error: (err) => {
          //console.log(err);
          this.isLoading = false;
        },
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}
