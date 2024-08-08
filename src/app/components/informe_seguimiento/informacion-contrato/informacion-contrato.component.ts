import { Component } from '@angular/core';
import { InformacionContrato } from 'src/app/models/informacion.contrato.model'
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { PopUpManager } from 'src/app/managers/popUpManager';

@Component({
  selector: 'app-informacion-contrato',
  templateUrl: './informacion-contrato.component.html',
  styleUrls: ['./informacion-contrato.component.css']
})
export class InformacionContratoComponent {

  numeroContrato!: string;
  vigencia! : string;

  informacion_contrato!: InformacionContrato

  constructor(
    private cumplidosMidServices: CumplidosProveedoresMidService,
    private popUpManager: PopUpManager,
    private translate: TranslateService,
  ) {
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      });
  }

  ngOnInit() {
    this.cumplidosMidServices.contrato$.subscribe((contrato: any) => {
      this.numeroContrato = contrato.Contrato.NumeroContratoSuscrito;
      this.vigencia = contrato.Contrato.Vigencia;
      this.informacion_contrato.numero_contrato =  this.numeroContrato;
      this.informacion_contrato.nombre_proveedor = contrato.Contrato.NombreProveedor;
      this.informacion_contrato.cdp = contrato.Contrato.NumeroCdp;
      this.informacion_contrato.tipo_contrato = contrato.Contrato.TipoContrato;
      this.informacion_contrato.rp = contrato.Contrato.NumeroRp;
    }
    );
    console.log(this.informacion_contrato)
    this.getInformacionContrato();

  }


  getInformacionContrato(){
    this.cumplidosMidServices.get('balance-financiero-contrato/' + this.numeroContrato + '/' + this.vigencia)
    .subscribe({
      next: (res: any) => {
        this.informacion_contrato.saldo = res.Data.saldo;
        this.informacion_contrato.total_contrato = res.Data.total_contrato;
      },
      error: (err: any) => {
        this.popUpManager.showErrorAlert(this.translate.instant('Error al consultar el balance financiero del contrato'));
      }
    })
  }


}
