import { Component } from '@angular/core';
import { Soporte } from 'src/app/models/soporte.model';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { SoportesServicesService } from 'src/app/services/soportes.services.service';



@Component({
  selector: 'app-visualizar-soportes',
  templateUrl: './visualizar-soportes.component.html',
  styleUrls: ['./visualizar-soportes.component.css']
})
export class VisualizarSoportesComponent {

  tittle = 'VER SOPORTES'


}
