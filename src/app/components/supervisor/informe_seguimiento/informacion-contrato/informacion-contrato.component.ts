import { Component, Input} from '@angular/core';
import { InformacionContrato } from 'src/app/models/informacion.contrato.model'
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { CumplidosProveedoresCrudService } from 'src/app/services/cumplidos_proveedores_crud.service'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { PopUpManager } from 'src/app/managers/popUpManager';

@Component({
  selector: 'app-informacion-contrato',
  templateUrl: './informacion-contrato.component.html',
  styleUrls: ['./informacion-contrato.component.scss']
})
export class InformacionContratoComponent {

  contrato: InformacionContrato = {
    numeroContrato: '',
    nombreProveedor: '',
    numeroCdp: 0,
    tipoContrato: '',
    rp: 0,
    saldo: 0,
    total_contrato: 0
  };
  vigencia!: string

  //@Input({required:true})cumplido


  constructor(
    private cumplidosMidServices: CumplidosProveedoresMidService,
    private cumplidosCrudServices: CumplidosProveedoresCrudService,
    private popUpManager: PopUpManager,
    private translate: TranslateService,
  ) {
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      });
  }

  ngOnInit() {
    
    this.cumplidosMidServices.contrato$.subscribe(contrato => {
      if (contrato){
        this.contrato.nombreProveedor = contrato.Contrato.NombreProveedor;
        this.contrato.numeroContrato = contrato.Contrato.NumeroContratoSuscrito;
        this.contrato.numeroCdp = contrato.Contrato.NumeroCdp;
        this.contrato.rp = contrato.Contrato.NumeroRp;
        this.contrato.tipoContrato = contrato.Contrato.TipoContrato;
        this.vigencia = contrato.Contrato.Vigencia;
      }else{
        this.popUpManager.showErrorAlert(
          'No se registra información del contrato.'
        );
      }
    })

    this.getBalanceFinanciero(this.contrato.numeroContrato, this.vigencia)

  }



  getBalanceFinanciero(numero_contrato: string, vigencia: string){
    this.cumplidosMidServices.get(`/supervisor/balance-financiero-contrato/${numero_contrato}/${vigencia}`)
    .subscribe({
      next: (res: any) => {
        this.contrato.saldo = res.Data.saldo
        this.contrato.total_contrato = res.Data.total_contrato
      },
      error: (error: any) => {
        this.popUpManager.showErrorAlert(
          'No se ha podido obtener el balance financiero.'
        );
        
      }
    })
  }


}
