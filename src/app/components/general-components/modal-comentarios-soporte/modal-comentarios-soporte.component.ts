import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { InformacionComentarioIndividual } from 'src/app/models/informacion-comentario-individual';
import { ModalComentariosSoporteData, Mode, RolUsuario } from 'src/app/models/modal-soporte-cumplido-data.model';
import { ComentarioSoporte } from 'src/app/models/revision_cumplidos_proveedores_crud/comentario-soporte.model';
import { CumplidosProveedoresCrudService } from 'src/app/services/cumplidos_proveedores_crud.service';

@Component({
  selector: 'app-modal-comentarios-soporte',
  templateUrl: './modal-comentarios-soporte.component.html',
  styleUrls: ['./modal-comentarios-soporte.component.scss']
})
export class ModalComentariosSoporteComponent implements OnInit {

  comentarios: ComentarioSoporte[] = [];  // Inicializamos la lista de comentarios vacía
  informacionComentarioIndividual: InformacionComentarioIndividual[] = [];
  isLoading: boolean = false;  // Indicador para saber si estamos cargando los datos

  mode = Mode;
  rolUsuario = RolUsuario;

  constructor(
    public dialogRef: MatDialogRef<ModalComentariosSoporteComponent>,
    private cumplidos_provedore_crud_service: CumplidosProveedoresCrudService,
    private popUpManager: PopUpManager,
    @Inject(MAT_DIALOG_DATA) public data: ModalComentariosSoporteData
  ) { }

  ngOnInit(): void {
    this.obtenerComentariosSoporte();
  }

  obtenerComentariosSoporte() {
    if (this.data.SoporteId !== 0) {
      this.isLoading = true;
      this.cumplidos_provedore_crud_service.get(`/comentario_soporte/?query=SoporteCumplidoId.Id:${this.data.SoporteId}&sortby=FechaCreacion&order=desc`).subscribe({
        next: (comentarios) => {
          this.isLoading = false;
          if (comentarios.Data && comentarios.Data.length > 0) {
            this.comentarios = comentarios.Data;
            this.informacionComentarioIndividual = this.comentarios.map((comentario: ComentarioSoporte) => {
              return {
                Rol: comentario.CambioEstadoCumplidoId.CargoResponsable,
                Fecha: comentario.FechaModificacion,
                Comentario: comentario.Comentario
              };
            });
          } else {
            this.comentarios = [];
            this.informacionComentarioIndividual = [];
            this.popUpManager.showAlert('Soporte sin comentarios', 'Este soporte no tiene comentarios registrados');
          }
        },
        error: () => {
          this.isLoading = false;
          this.comentarios = [];
          this.informacionComentarioIndividual = [];
          this.popUpManager.showErrorAlert('Hubo un error al recuperar los comentarios del soporte');
        }
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }

}
