import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-formulario-informe-seguimiento',
  templateUrl: './formulario-informe-seguimiento.component.html',
  styleUrls: ['./formulario-informe-seguimiento.component.css']
})
export class FormularioInformeSeguimientoComponent implements OnInit {

  formularioInformeSeguimiento!: FormGroup;
  numeroContrato!: string;
  vigencia!: string;
  pdfBase64!: string;
  nameFile!: string;

  constructor(
    private fg: FormBuilder,
    private cumplidosMidServices: CumplidosProveedoresMidService,
    private popUpManager: PopUpManager,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private utilsService: UtilsService

  ) {}

  ngOnInit() {


    this.formularioInformeSeguimiento = this.fg.group({
      "tipo_pago": new FormControl("", Validators.required),
      "fecha_inicio": "",
      "fecha_fin": "",
      "cuenta_cobro": "",
      "numero_cuenta": new FormControl("", {
        validators: [Validators.required, Validators.pattern('^[0-9]*$')],
      }),
      "valor_pagar":"",
      "tipo_cuenta": new FormControl("", Validators.required),
      "visualizar_numero_cuenta": new FormControl("", {
        validators: [Validators.required, Validators.pattern('^[0-9]*$')],
      }),
      "banco": new FormControl("", {
        validators: [Validators.required, Validators.pattern(/^(?! )[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+(?<! )$/)],
      })
    });

  }

  tipos_pago = [
    { id: 1, nombre: "Parcial" },
    { id: 2, nombre: "Unico" },
    { id: 3, nombre: "Totalmente" },
  ];

  tipos_cuenta = [
    { id: 1, nombre: "Ahorros" },
    { id: 2, nombre: "Corriente" },
  ];



  cuentas_cobro = [
    {id: 1, nombre:"Factura electronica de venta"},
    {id: 2, nombre: "Cuenta de cobro"}
  ];

  convertirFechaFormato(fecha: Date): string | null {
    return this.datePipe.transform(fecha, 'dd/MM/yyyy');
  }

  submitFormularioInformeSeguimiento(){
    this.cumplidosMidServices.contrato$.subscribe(contrato => {
      if (contrato){
        this.numeroContrato = contrato.Contrato.NumeroContratoSuscrito;
        this.vigencia = contrato.Contrato.Vigencia;
      }else{
        this.popUpManager.showErrorAlert('No se registra informacion del contrato');
      }
    })
    if(this.formularioInformeSeguimiento.valid){

      const body = {
        "BancoId": 1,
        "NumeroContratoSuscrito": Number(this.numeroContrato),
        "NumeroCuenta": this.formularioInformeSeguimiento.value.numero_cuenta,
        "NumeroCuentaFactura": this.formularioInformeSeguimiento.value.numero_cuenta,
        "PeiodoInicio": this.convertirFechaFormato(this.formularioInformeSeguimiento.value.fecha_inicio),
        "PeriodoFin": this.convertirFechaFormato(this.formularioInformeSeguimiento.value.fecha_fin),
        "TipoCuenta": this.formularioInformeSeguimiento.value.tipo_cuenta.nombre,
        "TipoPagoId": this.formularioInformeSeguimiento.value.tipo_pago.nombre,
        "TipoDocumentoCobroId": this.formularioInformeSeguimiento.value.cuenta_cobro.nombre,
        "ValorPagar": Number(this.formularioInformeSeguimiento.value.valor_pagar),
        "VigenciaContrato": this.vigencia
      }
      this.cumplidosMidServices.post('/supervisor/informe-seguimiento', body)
      .subscribe({
        next: (res: any) => {
          this.pdfBase64 = res.Data.file;
          this.nameFile = res.Data.prueba
          this.popUpManager.showSuccessAlert('Informe de seguimiento creado exitosamente');
        },
        error: (error: any) => {
          this.popUpManager.showErrorAlert('Error al crear el informe de seguimiento');
        }
      });
    }else{
      this.popUpManager.showErrorAlert('Datos incorrectos o faltantes');
    }
  }

  VerInformeSegumiento(){
    if (this.pdfBase64 === undefined) {
      this.popUpManager.showErrorAlert('No se ha generado el informe de seguimiento');
      return;
    } else {
      const arrayBuffer = this.utilsService.base64ToArrayBuffer(this.pdfBase64);
      const file = new Blob([arrayBuffer], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);

      /*
      const dialogRef = this.dialog.open(VerSoporteModalComponent, {
        width: '53%',
        height: '70%',
        panelClass: 'custom-dialog-container',
        data: { fileURL: fileURL }
      });

      */

      window.open(
        fileURL,
        this.nameFile,
        "resizable=yes,status=no,location=no,toolbar=no,menubar=no,fullscreen=yes,scrollbars=yes,dependent=no,width=800,height=900"
      );
    }

  }

}
