import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import {
  CurrencyPipe
} from '@angular/common'
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { MatDialog } from '@angular/material/dialog';
import { SolicituDeFirma } from 'src/app/models/certificado-pago.model';
import { ActivatedRoute } from '@angular/router';
import { CoreApiService } from '../../../../services/core_api.service';
import { CumplidosProveedoresCrudService } from 'src/app/services/cumplidos_proveedores_crud.service';
import { Banco } from 'src/app/models/banco.model';
import { TipoPago } from 'src/app/models/tipo_pago.model';
import { TipoCuentaBancaria } from 'src/app/models/tipo_cuenta_bancaria.model';
import { lastValueFrom } from 'rxjs';
import { DocumentoCobro } from 'src/app/models/documento_cobro.model';
import Swal from 'sweetalert2';
import { ModalVisualizarSoporteComponent } from '../../../general-components/modal-visualizar-soporte/modal-visualizar-soporte.component';
import { UserService } from './../../../../services/user.services';
import { FirmaElectronicaService } from 'src/app/services/firma_electronica_mid.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-formulario-informe-satisfaccion',
  templateUrl: './formulario-informe-satisfaccion.component.html',
  styleUrls: ['./formulario-informe-satisfaccion.component.scss'],
})
export class FormularioInformeSatisfaccionComponent implements OnInit {
  formularioInformeSeguimiento!: FormGroup;
  informacionBancariaForm!: FormGroup;
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
  idProveedor!: string;
  tipoCuentaBancaria!: any;
  banco!: any;
  numeroDeCuenta!: string;
  botonCambiarInfomacionActivo = false;
  mostrarAlerta:boolean=true;

  constructor(
    private fg: FormBuilder,
    private cumplidosMidServices: CumplidosProveedoresMidService,
    private cumplidosCrudServices: CumplidosProveedoresCrudService,
    private popUpManager: PopUpManager,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private coreApiService: CoreApiService,
    private cumplidoService: CumplidosProveedoresMidService,
    private userService: UserService,
    private firmaElectronica: FirmaElectronicaService,
    private utilService:UtilsService,
    private currencyPipe:CurrencyPipe
  ) {
    this.formularioInformeSeguimiento = this.fg.group(
      {
        tipo_pago: [null, Validators.required],
        fecha_inicio: ['', Validators.required],
        fecha_fin: ['', Validators.required],
        tipo_cobro: [null, Validators.required],

        numero_factura: ['', Validators.required],
        valor_cumplido: ['', Validators.required],
      },
      { validator: this.validarFecha() }
    );
    this.informacionBancariaForm = this.fg.group({
      banco: [
        { value: null, disabled: this.habilitarInformacionBancaria },
        Validators.required,
      ],
      tipo_cuenta: [
        { value: null, disabled: this.habilitarInformacionBancaria },
        Validators.required,
      ],
      numero_cuenta: [
        { value: null, disabled: this.habilitarInformacionBancaria },
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
    });

  }

  async ngOnInit() {

    this.formularioInformeSeguimiento.valueChanges.subscribe((form) => {
      if (form.valor_cumplido){
        this.formularioInformeSeguimiento.patchValue({
          valor_cumplido: this.currencyPipe.transform(form.valor_cumplido.replace(/\D/g, '').replace(/^0+/,''),'USD','symbol','1.0-0')
        },{emitEvent:false})
      }
    })
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

    this.cumplidosMidServices.contrato$.subscribe((contrato) => {
      if (contrato) {
        this.numeroContrato = contrato.Contrato.NumeroContratoSuscrito;
        this.vigencia = contrato.Contrato.Vigencia;
      } else {
        this.popUpManager.showErrorAlert(
          'No se registra información del contrato.'
        );
      }
    });

    await this.obtenerBancos();
    await this.obtenerTiposPago();
    await this.obtenerTiposDocumentoCobro();
    await this.buscarInformacionPago();
    if (this.nuevoFormuario) {
      await this.consultarInformacionBnacariaFormularioNuevo();
    }

    this.informacionBancariaForm
      .get('banco')
      ?.valueChanges.subscribe(async (banco) => {
        if (banco) {
          await this.obtenerTipoCuentaBancaria(banco.Id);
        } else {
          this.listaTiposCuentaBancaria = [];
        }
      });
    this.informacionBancariaForm.disable;
  }

  async obtenerBancos() {
    try {
      const response = await lastValueFrom(
        this.coreApiService.get('/banco?limit=-1')
      );
      this.listaBancos = response;
    } catch (error) {
      this.popUpManager.showErrorAlert(
        'Error al intentar recuperar el listado de bancos.'
      );
      throw error;
    }
  }

  async obtenerTiposDocumentoCobro() {
    try {
      const response = await lastValueFrom(
        this.coreApiService.get(`/tipo_documento_cobro`)
      );

      this.listaDocumentoCobro = response;
    } catch (error) {
      this.popUpManager.showErrorAlert(
        'Se produjo un error al consultar los tipos de cobro.'
      );
      throw error;
    }
  }

  async obtenerTipoCuentaBancaria(bancoId: number) {
    try {
      const response = await lastValueFrom(
        this.coreApiService.get(
          `/tipo_cuenta_bancaria?query=BancoId.Id:${bancoId}`
        )
      );
      if (response) {
        this.listaTiposCuentaBancaria = response;
      }
    } catch (error) {
      this.popUpManager.showErrorAlert(
        'Error al intentar consultar los tipos de cuentas bancarias.'
      );
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
    let confirm = await this.popUpManager.showConfirmAlert(
      'Información pago guardada'
    );
    if (confirm.isConfirmed) {
      const body = this.obtenerInformacionPagoGuardar();
      this.guardatinformacionPagoSolictud(body);
    }
  }

  async generarSoporte() {
    const body = this.obtenerInformacionPagoGenerarDocumento();

    let confirm = await this.popUpManager.showConfirmAlert(
      '¿Deseas generar el soporte?'
    );

    if (confirm.isConfirmed) {
      if (
        this.formularioInformeSeguimiento.valid &&
        this.validarInformacionbancaria()
      ) {
        this.popUpManager.showLoadingAlert(
          'Espera, por favor',
          'Estamos generando tu documento. Esto puede tardar unos momentos. ¡Gracias por tu paciencia!'
        );

        this.cumplidosMidServices
          .post('/supervisor/cumplido-satisfaccion', body)
          .subscribe({
            next: (res: any) => {
              this.solicituDeFirma = {
                NombreArchivo: res.Data.NombreArchivo,
                NombreResponsable: res.Data.NombreResponsable,
                CargoResponsable: res.Data.CargoResponsable,
                DescripcionDocumento: res.Data.DescripcionDocumento,
                Archivo: res.Data.Archivo,
              };
              this.nameFile = this.solicituDeFirma.NombreArchivo;
              this.pdfBase64 = res.Data.Archivo;
            },

            error: (error: any) => {
              this.popUpManager.showErrorAlert(
                'Error al intentar crear el informe de seguimiento.'
              );
            },
            complete: async () => {
              const body = this.obtenerInformacionPagoGuardar();
              this.mostrarAlerta=false
              await this.guardatinformacionPagoSolictud(body);
              this.modalVerSoporte();

            },
          });
      } else {
        this.showDetailedErrors();
        this.informacionBancariaForm.markAllAsTouched();
        this.formularioInformeSeguimiento.markAllAsTouched();
        this.popUpManager.showErrorAlert(
          'Datos incorrectos o faltantes. Por favor, verifica la información.'
        );
      }
    }
  }

  showDetailedErrors() {
    const controls = this.formularioInformeSeguimiento.controls;
    Object.keys(controls).forEach((controlName) => {
      const control = controls[controlName];
      if (control.invalid) {
      }
    });
  }

   modalVerSoporte() {
this.utilService.obtenerIdDocumento("CS").then(idDocumento=>{
  const visualizarSoportes = this.dialog.open(
    ModalVisualizarSoporteComponent,
    {
      disableClose: true,
      height: 'auto',
      width: 'auto',
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
            Color: '#731b14',
            TextColor: '#ffffff',
            Function: () => {
              if (idDocumento !== null) {
                this.firmaElectronica.firmarDocumento(
                  this.solicituDeFirma,
                  this.cumplidoId,
                  idDocumento,
                  true
                );
              } else {
                this.popUpManager.showErrorAlert('El ID del documento es null, no se puede firmar');
              }
            },
            Clases: '',
            Text: 'Firmar',
          },
        ],
      },
    }
  );
})

  }

  async buscarInformacionPago() {
    try {
      this.popUpManager.showLoadingAlert(
        'Cargando',
        'Por favor, espera mientras se carga la información.'
      );
      const response = await lastValueFrom(
        this.cumplidosCrudServices.get(
          `/informacion_pago?query=CumplidoProveedorId.Id:${this.cumplidoId}`
        )
      );

      if (response.Data[0]?.Id != undefined) {
        this.cumplido = response.Data[0];

        this.nuevoFormuario = false;
        this.informacionPagoId = response.Data[0].Id;
        const informePago = response.Data[0];
        this.bancoId = informePago.BancoId;
        this.tipoCuentaBancaria = informePago.TipoCuentaBancariaId;
        this.numeroDeCuenta = informePago.NumeroCuenta;
        await this.cargarIfnformacionBancaria();

        const tipoPagoSeleccionado = this.listaTipoDePago.find(
          (tipoPago) => tipoPago.Id == informePago.TipoPagoId.Id
        );
        const tipoCobroSelecconado = this.listaDocumentoCobro.find(
          (tipoCobro) => tipoCobro.Id == informePago.TipoDocumentoCobroId
        );

        this.formularioInformeSeguimiento.patchValue({
          fecha_inicio: informePago.FechaInicial,
          fecha_fin: informePago.FechaFinal,
          tipo_pago: tipoPagoSeleccionado,
          valor_cumplido: informePago.ValorCumplido,
          numero_factura: informePago.NumeroFactura,
          tipo_cobro: tipoCobroSelecconado,
        });
        await this.cargarFormularioIfnformacionBancaria();
      }
      Swal.close();
    } catch (error) {
      this.popUpManager.showErrorAlert(
        'Error al intentar consultar la información de pago.'
      );
    }
  }

  async cargarIfnformacionBancaria() {
    this.banco = this.listaBancos.find((banco) => banco.Id == this.bancoId);
    await this.obtenerTipoCuentaBancaria(this.banco?.Id ?? 0);
    if (typeof this.tipoCuentaBancaria === 'string') {
      this.tipoCuentaBancaria = this.listaTiposCuentaBancaria.find(
        (tipocuenta) => {
          return tipocuenta.Nombre.toLowerCase().includes(
            this.tipoCuentaBancaria.toLowerCase()
          );
        }
      );
    } else if (typeof this.tipoCuentaBancaria === 'number') {
      this.tipoCuentaBancaria = this.listaTiposCuentaBancaria.find(
        (tipocuenta) => tipocuenta.Id == this.tipoCuentaBancaria
      );
    } else {
      this.popUpManager.showErrorAlert(
        'Error al intentar consultar el tipo de cuenta.'
      );
    }
  }

  async cargarFormularioIfnformacionBancaria() {
    this.informacionBancariaForm.patchValue({
      banco: this.banco,
      tipo_cuenta: this.tipoCuentaBancaria,
      numero_cuenta: this.numeroDeCuenta,
    });
  }

  obtenerInformacionPagoGenerarDocumento() {

    return {
      Banco:
        this.informacionBancariaForm.get('banco')?.getRawValue()?.NombreBanco ?? "",
      NumeroContratoSuscrito: Number(this.numeroContrato) ?? 0,
      NumeroCuenta:
        this.informacionBancariaForm.getRawValue().numero_cuenta ?? '',
        NumeroCuentaFactura:
        this.formularioInformeSeguimiento
          .get('numero_factura')
          ?.getRawValue() ?? '',

          PeriodoInicio:
          this.formularioInformeSeguimiento.get('fecha_inicio')?.getRawValue() ??
          null,
          PeriodoFin:
          this.formularioInformeSeguimiento.get('fecha_fin')?.getRawValue() ??
          null,
          TipoCuenta:  this.informacionBancariaForm.get('tipo_cuenta')?.getRawValue()?.Nombre?? "",
          TipoPago:
          this.formularioInformeSeguimiento.get('tipo_pago')?.getRawValue()?.Nombre ?? ""

          ,

      TipoCuentaBancariaId: Number(
        this.informacionBancariaForm.get('tipo_cuenta')?.getRawValue()?.Id ?? 0
      ),
      TipoPagoId: {
        id: Number(
          this.formularioInformeSeguimiento.get('tipo_pago')?.getRawValue()
            ?.Id ?? 0
        ),
      },
      TipoFactura:this.formularioInformeSeguimiento.get('tipo_cobro')?.getRawValue().Nombre??"",

      ValorPagar: Number((this.formularioInformeSeguimiento.get('valor_cumplido')?.value ?? '0').replace(/[^\d]/g, '')),
      VigenciaContrato: this.vigencia ?? '',

    };
  }


  obtenerInformacionPagoGuardar() {
    return {
      BancoId:
        this.informacionBancariaForm.get('banco')?.getRawValue()?.Id ?? 0,
      NumeroContratoSuscrito: Number(this.numeroContrato) ?? 0,
      NumeroCuenta:
        this.informacionBancariaForm.getRawValue().numero_cuenta ?? '',
      NumeroFactura:
        this.formularioInformeSeguimiento
          .get('numero_factura')
          ?.getRawValue() ?? '',
      TipoCuentaBancariaId: Number(
        this.informacionBancariaForm.get('tipo_cuenta')?.getRawValue()?.Id ?? 0
      ),
      TipoPagoId: {
        id: Number(
          this.formularioInformeSeguimiento.get('tipo_pago')?.getRawValue()
            ?.Id ?? 0
        ),
      },
      CumplidoProveedorId: { id: this.cumplidoId },
      TipoDocumentoCobroId: Number(
        this.formularioInformeSeguimiento.get('tipo_cobro')?.getRawValue()
          ?.Id ?? 0
      ),
      ValorCumplido: Number((this.formularioInformeSeguimiento.get('valor_cumplido')?.value ?? '0').replace(/[^\d]/g, '')),
      VigenciaContrato: this.vigencia ?? '',
      FechaInicial:
        this.formularioInformeSeguimiento.get('fecha_inicio')?.getRawValue() ??
        null,
      FechaFinal:
        this.formularioInformeSeguimiento.get('fecha_fin')?.getRawValue() ??
        null,
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

  private async guardatinformacionPagoSolictud(body: any) {
    if (this.validacionGuardar()) {
      this.popUpManager.showLoadingAlert(
        'Guardando',
        'Por favor, espera mientras se guarda la información.'
      );
      if (this.nuevoFormuario) {
        try {
          this.cumplidosCrudServices.post('/informacion_pago/', body).subscribe(
            (response: any) => {
              this.nuevoFormuario = false;
              this.informacionPagoId = response.Data.Id;
              Swal.close();
              if(this.mostrarAlerta){
              this.popUpManager.showSuccessAlert(
                'Se guardó el informe correctamente.'
              );
            }
            this.mostrarAlerta=true;
            },
            (error) => {
              Swal.close();
              this.popUpManager.showErrorAlert(
                'Error al intentar guardar la información de pago.'
              );
            }
          );
        } catch (error) {
          Swal.close();
          this.popUpManager.showErrorAlert(
            'Error al intentar guardar la información de pago.'
          );
        }
      } else {
        try {
          this.cumplidosCrudServices
            .put(`/informacion_pago/${this.informacionPagoId}`, body)
            .subscribe(
              (response) => {
                Swal.close();
                if(this.mostrarAlerta){
                  this.popUpManager.showSuccessAlert(
                    'Se guardó el informe correctamente.'
                  );
                }
                this.mostrarAlerta=true;
              },
              (error) => {
                Swal.close();
                this.popUpManager.showErrorAlert(
                  'Error al intentar guardar la información de pago.'
                );
              }
            );
        } catch (error) {
          Swal.close();
          this.popUpManager.showErrorAlert(
            'Error al intentar guardar la información de pago.'
          );
        }
      }
    }
  }

  async habilitarInfromacionBancaria() {
    let confirm = await this.popUpManager.showConfirmAlert(
      '¿Modificar información bancaria?',
      'Los cambios realizados no se guardarán en la información del proveedor, sino solo en la información de pago y únicamente para esta solicitud.'
    );

    if (confirm.isConfirmed) {
      this.informacionBancariaForm.enable();
      this.botonCambiarInfomacionActivo = true;
    }
  }

  validarInformacionbancaria() {
    const bancoValid = this.informacionBancariaForm.get('banco')?.value != null;
    const tipoCuentaValid =
      this.informacionBancariaForm.get('tipo_cuenta')?.value != null;
    const numeroCuentaValid =
      this.informacionBancariaForm.get('numero_cuenta')?.value &&
      /^[0-9]*$/.test(this.informacionBancariaForm.get('numero_cuenta')?.value);

    return bancoValid && tipoCuentaValid && numeroCuentaValid;
  }

  async consultarInformacionBnacariaFormularioNuevo() {
    this.popUpManager.showLoadingAlert(
      'Cargando',
      'Por favor, espera mientras se carga la información.'
    );
    try {
      const infoContrato = await lastValueFrom(
        this.userService.obtenerInformacionContrato(
          this.numeroContrato,
          this.vigencia
        )
      );
      this.idProveedor = infoContrato[0].Contratista;
      const infoProveedor = await lastValueFrom(
        this.userService.obtenerInformacioProveedor(this.idProveedor)
      );
      this.numeroDeCuenta = infoProveedor[0].NumCuentaBancaria;
      this.tipoCuentaBancaria = infoProveedor[0].TipoCuentaBancaria;
      this.banco = infoProveedor[0].IdEntidadBancaria;
      await this.cargarIfnformacionBancaria();
      await this.cargarFormularioIfnformacionBancaria();
      Swal.close();
    } catch (error) {
      this.popUpManager.showErrorAlert(
        'Error al intentar consultar la información del contrato.'
      );
    }
  }

  validacionGuardar(): boolean {
    let isValid = true;
    const numeroCuentaControl =
      this.formularioInformeSeguimiento.get('tipo_pago');
    const fechaInicioControl =
      this.formularioInformeSeguimiento.get('fecha_inicio');
    const fechaFinControl = this.formularioInformeSeguimiento.get('fecha_fin');
    const TipoCobroControl =
      this.formularioInformeSeguimiento.get('tipo_cobro');
    const TipoCuentaControl = this.informacionBancariaForm.get('tipo_cuenta');
    const BancoControl = this.informacionBancariaForm.get('banco');
    if (numeroCuentaControl?.invalid) {
      numeroCuentaControl.markAsTouched();
      isValid = false;
    }

    if (fechaInicioControl?.invalid) {
      fechaInicioControl.markAsTouched();
      isValid = false;
    }
    if (fechaFinControl?.invalid) {
      fechaFinControl.markAsTouched();
      isValid = false;
    }
    if (TipoCuentaControl?.invalid) {
      TipoCuentaControl.markAsTouched();
      isValid = false;
    }
    if (BancoControl?.invalid) {
      BancoControl.markAsTouched();
      isValid = false;
    }

    if (TipoCobroControl?.invalid) {
      TipoCobroControl.markAsTouched();
      isValid = false;
    }

    return isValid;
  }
}
