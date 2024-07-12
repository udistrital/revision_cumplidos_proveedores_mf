import { Component } from '@angular/core';
import { InformacionContrato } from 'src/app/models/informacion.contrato.model'

@Component({
  selector: 'app-informacion-contrato',
  templateUrl: './informacion-contrato.component.html',
  styleUrls: ['./informacion-contrato.component.css']
})
export class InformacionContratoComponent {

  informacion_contrato: InformacionContrato = {
    numero_contrato: 1245,
    nombre_proveedor: 'Pollito coprs S.A.S.',
    cdp: 2154,
    tipo_contrato: 'Orden de servicio',
    saldo: 6000000000,
    crp: 2554,
    total_contrato: 9000000000
  }
}
