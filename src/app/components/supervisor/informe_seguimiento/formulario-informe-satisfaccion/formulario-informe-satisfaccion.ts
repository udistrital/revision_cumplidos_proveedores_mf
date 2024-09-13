import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { SolicituDeFirma } from 'src/app/models/certificado-pago.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreApiService } from '../../../../services/core_api.service';
import { CumplidosProveedoresCrudService } from 'src/app/services/cumplidos_proveedores_crud.service';
import { Banco } from 'src/app/models/banco.model';
import { AletManagerService } from 'src/app/managers/alert-manager.service';
import { TipoPago } from 'src/app/models/tipo_pago.model';
import { TipoCuentaBancaria } from 'src/app/models/tipo_cuenta_bancaria.model';
import { lastValueFrom } from 'rxjs';
import { DocumentoCobro } from 'src/app/models/documento_cobro.model';
import Swal from 'sweetalert2';
import { ModalVisualizarSoporteComponent } from '../../../general-components/modal-visualizar-soporte/modal-visualizar-soporte.component';

@Component({
  selector: 'app-formulario-informe-satisfaccion',
  templateUrl: './formulario-informe-satisfaccion.component.html',
  styleUrls: ['./formulario-informe-satisfaccion.component.css'],
})
export class FormularioInformeSatisfaccionComponent implements OnInit {
  formularioInformeSeguimiento: FormGroup;
  numeroContrato: string = '';
  vigencia: string = '';
  pdfBase64: string = '';
  nameFile: string = '';
  solicituDeFirma!: SolicituDeFirma;
  cumplidoId: number = 0;
  listaBancos: Banco[] = [];
  listaTiposCuentaBancaria: TipoCuentaBancaria[] = [];
  listaTipoDePago: TipoPago[] = [];
  listaDocumentoCobro: DocumentoCobro[] = [];
  nuevoFormuario: boolean = true;
  numero_factura: string = '';
  bancoId: number = 0;
  informacionPagoId: number = 0;
  cumplido: any;
  contrato: any;

  constructor(
    private fg: FormBuilder,
    private cumplidosMidServices: CumplidosProveedoresMidService,
    private cumplidosCrudServices: CumplidosProveedoresCrudService,
    private popUpManager: PopUpManager,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private coreApiService: CoreApiService,
    private alertService: AletManagerService,
    private cumplidoService: CumplidosProveedoresMidService,
    private router: Router
  ) {
    this.formularioInformeSeguimiento = this.fg.group(
      {
        tipo_pago: [null, Validators.required],
        fecha_inicio: [''],
        fecha_fin: [''],
        tipo_cobro: [null, Validators.required],
        numero_cuenta: [
          '',
          [Validators.required, Validators.pattern('^[0-9]*$')],
        ],
        numero_factura: [''],
        valor_cumplido: [''],
        banco: [null, Validators.required],
        tipo_cuenta: [null, Validators.required],
      },
      { validator: this.validarFecha() }
    );
  }

  async ngOnInit() {
    this.cumplidoService.cumplido$.subscribe((cumplido) => {
      this.cumplido = cumplido;
    });

    this.cumplidosMidServices.contrato$.subscribe((contrato) => {
      this.contrato = contrato;
    });

    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('cumplidoId');
      this.cumplidoId = idParam ? +idParam : 0;
    });

    await this.obtenerBancos();
    await this.obtenerTiposPago();
    await this.obtenerTiposDocumentoCobro();
    await this.buscarInformacionPago();
    this.formularioInformeSeguimiento
      .get('banco')
      ?.valueChanges.subscribe(async (banco) => {
        if (banco) {
          await this.obtenerTipoCuentaBancaria(banco.Id);
        } else {
          this.listaTiposCuentaBancaria = [];
        }
      });
  }

  async obtenerBancos() {
    try {
      const response = await lastValueFrom(
        this.coreApiService.get('/banco?limit=-1')
      );
      this.listaBancos = response;
    } catch (error) {
      this.alertService.showErrorAlert('Error');
      throw error;
    }
  }

  async obtenerTiposDocumentoCobro() {
    try {
      const response = await lastValueFrom(
        this.coreApiService.get(`/tipo_documento_cobro`)
      );

      this.listaDocumentoCobro = response;
      console.log(this.listaDocumentoCobro);
    } catch (error) {
      this.alertService.showErrorAlert(
        'Se produjo un errro al colsultar los tipos de cobro'
      );
      throw error;
    }
  }

  async obtenerTipoCuentaBancaria(bancoId: number) {
    console.log(bancoId);
    try {
      const response = await lastValueFrom(
        this.coreApiService.get(
          `/tipo_cuenta_bancaria?query=BancoId.Id:${bancoId}`
        )
      );
      if (response) {
        this.listaTiposCuentaBancaria = response;
        console.log('response', response);
      }
    } catch (error) {
      this.alertService.showErrorAlert('Error');
      throw error;
    }
  }

  async obtenerTiposPago() {
    try {
      const response = await lastValueFrom(
        this.cumplidosCrudServices.get(`/tipo_pago`)
      );

      if (response?.Data) {
        this.listaTipoDePago = response.Data;
      } else {
        this.listaTipoDePago = [];
      }
    } catch (error) {
      this.listaTiposCuentaBancaria = [];
    }
  }

  async guardarIformacionPago() {
    let confirm = await this.alertService.alertConfirm('Guardado');

    if (confirm.isConfirmed) {
      const body = this.obtenerInformacionPago();
      if (this.nuevoFormuario) {
        try {
          this.cumplidosCrudServices.post('/informacion_pago/', body).subscribe(
            (response) => {
              this.alertService.showSuccessAlert(
                'Guardado',
                'Se guardo el infrome'
              );
            },
            (error) => {
              this.alertService.showCancelAlert(
                'Error',
                'Se produjo el error' + error
              );
            }
          );
        } catch (error) {
          this.alertService.showCancelAlert(
            'Error',
            'Se produjo el error' + error
          );
        }
      } else {
        try {
          this.cumplidosCrudServices
            .put(`/informacion_pago/${this.informacionPagoId}`, body)
            .subscribe(
              (response) => {
                this.alertService.showSuccessAlert(
                  'Guardado',
                  'Se guardo el infrome'
                );
              },
              (error) => {
                this.alertService.showCancelAlert(
                  'Error',
                  'Se produjo el error' + error
                );
              }
            );
        } catch (error) {
          this.alertService.showCancelAlert(
            'Error',
            'Se produjo el error' + error
          );
        }
      }
    } else {
      this.alertService.showCancelAlert(
        'Cancelado',
        'No se realizaron Cambios'
      );
    }
  }

  async generarSoporte() {
    let confirm = await this.alertService.alertConfirm('¿Generar soporte?');

    this.cumplidosMidServices.contrato$.subscribe((contrato) => {
      if (contrato) {
        this.numeroContrato = contrato.Contrato.NumeroContratoSuscrito;
        this.vigencia = contrato.Contrato.Vigencia;
      } else {
        this.popUpManager.showErrorAlert(
          'No se registra informacion del contrato'
        );
      }
    });

    if (confirm.isConfirmed) {
      if (this.formularioInformeSeguimiento.valid) {
        this.alertService.showLoadingAlert(
          'Espera por favor',
          'Estamos generando tu documento. Esto puede tardar unos momentos. Gracias.'
        );
        const body = this.obtenerInformacionPago();

        this.cumplidosMidServices
          .post('/supervisor/cumplido-satisfaccion', body)
          .subscribe({
            next: (res: any) => {
              console.log('response', res.Data);
              this.solicituDeFirma = new SolicituDeFirma(
                res.Data.NombreArchivo,
                res.Data.NombreResponsable,
                res.Data.CargoResponsable,
                res.Data.DescripcionDocumento,
                res.Data.Archivo
              );
              console.log(this.solicituDeFirma.Archivo)
              this.pdfBase64 = this.solicituDeFirma.Archivo;
              this.nameFile = this.solicituDeFirma.NombreArchivo;
            },

            error: (error: any) => {
              this.popUpManager.showErrorAlert(
                'Error al crear el informe de seguimiento'
              );
            },
            complete: () => {
              Swal.close();
              this.modalVerSoporte();
            },
          });
      } else {
        this.showDetailedErrors();
        this.popUpManager.showErrorAlert('Datos incorrectos o faltantes');
      }
    }
  }

  showDetailedErrors() {
    const controls = this.formularioInformeSeguimiento.controls;
    Object.keys(controls).forEach((controlName) => {
      const control = controls[controlName];
      if (control.invalid) {
        console.log(`Control: ${controlName}`);
        console.log('Valor:', control.value);
        console.log('Errores:', control.errors);
      }
    });
  }

  modalVerSoporte() {
    this.dialog.open(ModalVisualizarSoporteComponent, {
      disableClose: true,
      height: '70vh',
      width: '40vw',
      maxWidth: '60vw',
      maxHeight: '80vh',
      panelClass: 'custom-dialog-container',
      data: {
        documentoAFirmar: this.solicituDeFirma,
        aprobarSoportes: true,
        idCumplido: this.cumplidoId,
        tipoDocumento: 168,
        url: this.pdfBase64,
        cargoResponsable: 'Supervisor',
        cumplido: this.cumplido,
        regresarACargaDocumentos: false,
      },
    });
  }

  async buscarInformacionPago() {
    try {
      this.alertService.showLoadingAlert(
        'Cargado',
        'Espera mientras se carga la informacion'
      );
      const response = await lastValueFrom(
        this.cumplidosCrudServices.get(
          `/informacion_pago?query=CumplidoProveedorId.Id:${this.cumplidoId}`
        )
      );
      Swal.close();

      if (response.Data[0]?.Id != undefined) {
        this.cumplido = response.Data[0];

        this.nuevoFormuario = false;
        this.informacionPagoId = response.Data[0].Id;
        const informePago = response.Data[0];
        const bancoSeleccionado = this.listaBancos.find(
          (banco) => banco.Id == informePago.BancoId
        );
        await this.obtenerTipoCuentaBancaria(bancoSeleccionado?.Id ?? 0);

        const tipoCuentaBancaria = this.listaTiposCuentaBancaria.find(
          (tipocuenta) => tipocuenta.Id == informePago.TipoCuentaBancariaId
        );
        const tipoPagoSeleccionado = this.listaTipoDePago.find(
          (tipoPago) => tipoPago.Id == informePago.TipoPagoId.Id
        );
        const tipoCobroSelecconado = this.listaDocumentoCobro.find(
          (tipoCobro) => tipoCobro.Id == informePago.TipoDocumentoCobroId
        );

        console.log('tipo cuenta:', tipoCuentaBancaria);
        this.formularioInformeSeguimiento.patchValue({
          banco: bancoSeleccionado,
          numero_cuenta: informePago.NumeroCuenta,
          fecha_inicio: informePago.FechaInicial,
          fecha_fin: informePago.FechaFinal,
          tipo_pago: tipoPagoSeleccionado,
          valor_cumplido: informePago.ValorCumplido,
          numero_factura: informePago.NumeroFactura,
          tipo_cobro: tipoCobroSelecconado,
          tipo_cuenta: tipoCuentaBancaria,
        });
      }
      Swal.close();
    } catch (error) {
      this.alertService.showCancelAlert(
        'Error',
        'Se genereo el siguiente error' + error
      );
    }
  }

  obtenerInformacionPago() {
    return {
      Banco:
        this.formularioInformeSeguimiento.get('banco')?.value.NombreBanco ?? 0,
      NumeroContratoSuscrito: Number(this.numeroContrato) ?? 0,
      NumeroCuenta: this.formularioInformeSeguimiento.value.numero_cuenta ?? '',
      NumeroCuentaFactura:
        this.formularioInformeSeguimiento.value.numero_factura ?? '',
      TipoCuenta:
        this.formularioInformeSeguimiento.get('tipo_cuenta')?.value.Nombre ?? 0,
      TipoPago:
this.formularioInformeSeguimiento.get('tipo_pago')?.value.Nombre ?? 0,
      TipoFactura:
        this.formularioInformeSeguimiento.get('tipo_cobro')?.value.Nombre ?? 0,
      ValorPagar: Number(
        this.formularioInformeSeguimiento.value.valor_cumplido
      ),
      VigenciaContrato: this.vigencia ?? '',
      PeriodoInicio:
        this.formularioInformeSeguimiento.get('fecha_inicio')?.value ?? null,
      PeriodoFin:
        this.formularioInformeSeguimiento.get('fecha_fin')?.value ?? null,
    };
  }

  validarFecha(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (this.formularioInformeSeguimiento) {
        const startDate =
          this.formularioInformeSeguimiento.get('fecha_inicio')?.value;
        const endDate =
          this.formularioInformeSeguimiento.get('fecha_fin')?.value;

        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
          return { dateRangeInvalid: true };
        }
      }

      return null;
    };
  }
}
