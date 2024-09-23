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
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
import { UserService } from './../../../../services/user.services';
import { DecodedToken } from './../../../../models/decode_token';
import { FirmaElectronicaService } from 'src/app/services/firma_electronica_mid.service';
import { ModalListarCumplidosComponent } from '../../modal-listar-cumplidos/modal-listar-cumplidos.component';

@Component({
  selector: 'app-formulario-informe-satisfaccion',
  templateUrl: './formulario-informe-satisfaccion.component.html',
  styleUrls: ['./formulario-informe-satisfaccion.component.scss'],
})
export class FormularioInformeSatisfaccionComponent implements OnInit {
  formularioInformeSeguimiento: FormGroup;
  informacionBancariaForm: FormGroup;
  habilitarInformacionBancaria = true;
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
  idProveedor!:string;

  constructor(
    private fg: FormBuilder,
    private cumplidosMidServices: CumplidosProveedoresMidService,
    private cumplidosCrudServices: CumplidosProveedoresCrudService,
    private popUpManager: PopUpManager,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private coreApiService: CoreApiService,
    private alertService: AletManagerService,
    private cumplidoService: CumplidosProveedoresMidService,
    private router: Router,
    private userService: UserService,
    private firmaElectronica: FirmaElectronicaService
  ) {
    this.formularioInformeSeguimiento = this.fg.group(
      {
        tipo_pago: [null, Validators.required],
        fecha_inicio: [''],
        fecha_fin: [''],
        tipo_cobro: [null, Validators.required],

        numero_factura: [''],
        valor_cumplido: [''],
      },
      { validator: this.validarFecha() }
    );
    this.informacionBancariaForm = this.fg.group({
      banco: [{ value: null, disabled: this.habilitarInformacionBancaria }, Validators.required],
      tipo_cuenta: [{ value: null, disabled: this.habilitarInformacionBancaria }, Validators.required],
      numero_cuenta: [
        { value: null, disabled: this.habilitarInformacionBancaria },
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
    });
  }

  async ngOnInit() {


    this.cumplidoService.cumplido$.subscribe((cumplido) => {
      this.cumplido = cumplido;
    });

    this.cumplidosMidServices.contrato$.subscribe((contrato) => {
      this.contrato = contrato;
    });


    console.log("cumplido",this.contrato);
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('cumplidoId');
      this.cumplidoId = idParam ? +idParam : 0;
    });

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
    this.informacionBancariaForm.disable;
  /*  this.userService.obtenerInformacionContrato("1512","2023").subscribe({
      next:(response:any)=>{
       this.idProveedor= response.Data.Contratista
      }
    })
      */
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
    console.log('antes de guardar ', this.nuevoFormuario);
    if (confirm.isConfirmed) {
      const body = this.obtenerInformacionPago();
      console.log('Despues de guardar ', this.nuevoFormuario);
      this.guardatinformacionPagoSolictud(body);
    } else {
      this.alertService.showCancelAlert(
        'Cancelado',
        'No se realizaron Cambios'
      );
    }
  }

  async generarSoporte() {
    console.log('Test de que se ejecuta el fomulario ');
    let confirm = await this.alertService.alertConfirm('¿Generar soporte?');

    if (confirm.isConfirmed) {
      if (
        this.formularioInformeSeguimiento.valid &&
        this.informacionBancariaForm.valid
      ) {
        this.alertService.showLoadingAlert(
          'Espera por favor',
          'Estamos generando tu documento. Esto puede tardar unos momentos. Gracias.'
        );
        const body = this.obtenerInformacionPago();
        this.guardatinformacionPagoSolictud(body);
        this.cumplidosMidServices
          .post('/supervisor/cumplido-satisfaccion', body)
          .subscribe({
            next: (res: any) => {
              console.log('response', res.Data.Data);
              this.solicituDeFirma = {
                NombreArchivo: res.Data.NombreArchivo,
                NombreResponsable: res.Data.NombreResponsable,
                CargoResponsable: res.Data.CargoResponsable,
                DescripcionDocumento: res.Data.DescripcionDocumento,
                Archivo: res.Data.Archivo,
              };
              console.log('Archivo', this.solicituDeFirma);
              this.nameFile = this.solicituDeFirma.NombreArchivo;
              this.pdfBase64 = res.Data.Archivo;
              console.log('test de archvio : ', res.Data.Archivo);
              console.log('test de asignacion: ', res.Data.Archivo);
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
    const visualizarSoportes = this.dialog.open(
      ModalVisualizarSoporteComponent,
      {
        disableClose: true,
        height: '70vh',
        width: '40vw',
        maxWidth: '60vw',
        maxHeight: '80vh',
        panelClass: 'custom-dialog-container',
        data: {
          aprobarSoportes: true,
          url: this.pdfBase64,
          cargoResponsable: 'Supervisor',
          regresarACargaDocumentos: false,
          ModalButtonsFunc: [
            {
              Color: 'red',
              Function: () => {
                this.firmaElectronica.firmarDocumento(
                  this.solicituDeFirma,
                  this.cumplidoId,
                  157,
                  true
                );
              },
              Clases: '',
              Text: 'Firmar',
            },
            {
              Color: 'red',
              Function: () => {
                visualizarSoportes.close();
              },
              Clases: '',
              Text: 'Cerar',
            },
          ],
        },
      }
    );
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
          numero_cuenta: informePago.NumeroCuenta,
          fecha_inicio: informePago.FechaInicial,
          fecha_fin: informePago.FechaFinal,
          tipo_pago: tipoPagoSeleccionado,
          valor_cumplido: informePago.ValorCumplido,
          numero_factura: informePago.NumeroFactura,
          tipo_cobro: tipoCobroSelecconado,
        });
        this.informacionBancariaForm.patchValue({
          banco: bancoSeleccionado,
          tipo_cuenta: tipoCuentaBancaria,
          numero_cuenta: informePago.NumeroCuenta,
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
    console.log(this.formularioInformeSeguimiento);
    return {
      BancoId: this.informacionBancariaForm.get('banco')?.value.Id ?? 0,
      NumeroContratoSuscrito: Number(this.numeroContrato) ?? 0,
      NumeroCuenta: this.informacionBancariaForm.value.numero_cuenta ?? '',
      NumeroFactura:
        this.formularioInformeSeguimiento.value.numero_factura ?? '',
      TipoCuentaBancariaId: Number(
        this.informacionBancariaForm.get('tipo_cuenta')?.value.Id ?? 0
      ),
      TipoPagoId: {
        id: Number(
          this.formularioInformeSeguimiento.get('tipo_pago')?.value.Id ?? 0
        ),
      },
      CumplidoProveedorId: { id: this.cumplidoId },
      TipoDocumentoCobroId: Number(
        this.formularioInformeSeguimiento.get('tipo_cobro')?.value.Id ?? 0
      ),
      ValorCumplido: Number(
        this.formularioInformeSeguimiento.get('valor_cumplido')?.value ?? 0
      ),
      VigenciaContrato: this.vigencia ?? '',
      FechaInicial:
        this.formularioInformeSeguimiento.get('fecha_inicio')?.value ?? null,
      FechaFinal:
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

  private guardatinformacionPagoSolictud(body: any) {
    if (this.nuevoFormuario) {
      try {
        this.cumplidosCrudServices.post('/informacion_pago/', body).subscribe(
          (response: any) => {
            this.nuevoFormuario = false;
            this.informacionPagoId = response.Data.Id;
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
  }

  async habilitarInfromacionBancaria(){
    let confirm = await this.alertService.alertConfirm('¿Modificar Informacion Bancaria?', "Los cambios realizados no se guardarán en la información del proveedor, sino únicamente en la información de pago y solo para esta solicitud.");

    if (confirm.isConfirmed) {
      this.informacionBancariaForm.enable();
    }

  }


  consultarInformacionBnacaria(){

  }
}
