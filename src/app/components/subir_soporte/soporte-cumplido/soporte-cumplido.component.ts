import { Component, Input } from '@angular/core';
import { Soporte } from 'src/app/models/soporte.model';
import { VerSoporteModalComponent } from '../ver-soporte-modal/ver-soporte-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { PopUpManager } from 'src/app/managers/popUpManager';


@Component({
  selector: 'app-soporte-cumplido',
  templateUrl: './soporte-cumplido.component.html',
  styleUrls: ['./soporte-cumplido.component.css']
})
export class SoporteCumplidoComponent {

  @Input() soporte!: Soporte;

  constructor(
    public dialog: MatDialog,
    private popUpManager: PopUpManager
  ){

  }

  verSoporte(base64Output: string, fileName: string) {
    if (base64Output) {
      this.dialog.open(VerSoporteModalComponent, {
        width: '53%',
        height: '70%',
        panelClass: 'custom-dialog-container',
        data: {
          base64: base64Output,
          fileName: fileName
        }
      });
    } else {
      this.popUpManager.showErrorAlert('No hay soporte cargado para ver');
    }
  }

}
