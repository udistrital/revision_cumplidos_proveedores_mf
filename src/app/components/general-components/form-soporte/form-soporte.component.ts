import {
  Component,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
  Input,
  numberAttribute,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-soporte',
  templateUrl: './form-soporte.component.html',
  styleUrls: ['./form-soporte.component.scss'],
})
export class FormSoporteComponent {
  opciones!: any;
  observaciones = '';
  base64Output: string | ArrayBuffer | null = '';
  fileName: string = 'Seleccione un archivo';
  idTipoDocumento!: number;
  cumplidoSatisfaccionSeleccionado: boolean = false;
  soporteForm!: FormGroup;
  itemId!: number;

  @Input({ required: true, transform: numberAttribute })
  cumplidoProveedorId!: number;
  @Output() recargarSoportes = new EventEmitter<any>();
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private cumplidosMidServices: CumplidosProveedoresMidService,
    private popUpManager: PopUpManager,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.soporteForm = this.fb.group({
      opcionSeleccionada: ['', [Validators.required]],
      observaciones: ['', [Validators.minLength(10)]],
      fileName: [{ value: '', disabled: true }, [Validators.required]],
    });
  }

  ngOnInit() {
    this.getTipoDocumentosCumplido();
  }

  getTipoDocumentosCumplido() {
    this.cumplidosMidServices
      .get('/supervisor/tipos-documentos-cumplido')
      .subscribe({
        next: (res: any) => {
          //res.Data.find((element:any) => element.CodigoAbreviacionTipoDocumento=='AG');
          this.opciones = res.Data;
        },
        error: (error: any) => {
          this.popUpManager.showErrorAlert(
            'No fue posible obtener los documentos que se pueden subir en el cumplido.'
          );
        },
      });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Verifica el tamaño del archivo
      if (file.size > 5000000) {
        this.popUpManager.showErrorAlert('El PDF no puede exceder los 5MB.');
        this.removeFile();
        return;
      }

      // Verifica que el archivo es un PDF real
      const reader = new FileReader();
      reader.onload = () => {
        const fileResult = new Uint8Array(reader.result as ArrayBuffer);
        const isValidPDF = this.isPDF(fileResult);

        if (!isValidPDF) {
          this.popUpManager.showErrorAlert('Solo se permiten archivos en formato PDF.');
          this.removeFile();
          return;
        }

        // Si es un PDF válido, procede a leer el archivo en base64
        this.fileName = file.name;
        this.soporteForm.patchValue({ fileName: this.fileName });
        const base64Reader = new FileReader();
        base64Reader.onload = () => {
          const base64Result = base64Reader.result as string;
          const base64Prefix = 'data:application/pdf;base64,';
          this.base64Output = base64Result.startsWith(base64Prefix)
            ? base64Result.slice(base64Prefix.length)
            : base64Result;
        };
        base64Reader.readAsDataURL(file);
      };
      reader.readAsArrayBuffer(file);
    }
  }

  isPDF(fileBytes: Uint8Array): boolean {
    const pdfSignature = [0x25, 0x50, 0x44, 0x46]; // %PDF en ASCII
    return pdfSignature.every((byte, index) => fileBytes[index] === byte);
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  removeFile() {
    this.fileInput.nativeElement.value = '';
    this.fileName = 'Seleccione un archivo';
    this.soporteForm.patchValue({ fileName: '' });
    this.base64Output = '';
  }

  uploadFile() {
    if (this.base64Output) {
      let payload = {
        SolicitudPagoID: this.cumplidoProveedorId,
        TipoDocumento: 'application/pdf',
        observaciones: this.soporteForm.value.observaciones.trim(),
        ItemID: this.itemId,
        NombreArchivo: this.fileName,
        Archivo: this.base64Output,
      };
      if (payload.observaciones == '') {
        payload.observaciones = 'Sin observaciones en el documento';
      }
      this.popUpManager.showLoadingAlert(
        'Cargando documento, por favor espera'
      );
      this.cumplidosMidServices
        .post('/solicitud-pago/soportes', payload)
        .subscribe({
          next: (res: any) => {
            this.recargarSoportes.emit(res);
          },
          error: (error: any) => {
            this.popUpManager.showErrorAlert(
              'Error al intentar cargar el archivo.'
            );
          },
          complete: () => {
            this.removeFile();
            this.soporteForm.reset({
              opcionSeleccionada: '',
              observaciones: '',
              fileName: '',
            });
            Swal.close();
            this.popUpManager.showSuccessAlert(
              'El archivo se ha cargado exitosamente.'
            );
          },
        });
    } else {
      this.popUpManager.showErrorAlert('No se ha seleccionado ningún archivo.');
    }
  }

  asignarItemId(item: number) {
    this.itemId = item;
  }

  crearDocumento() {
    this.dialog.closeAll();
    this.router.navigate(['/cumplido-satisfaccion', this.cumplidoProveedorId]);
  }

  cambioTipoDocumento(tipoDocumento: string) {
    if (tipoDocumento === 'CS') {
      this.cumplidoSatisfaccionSeleccionado = true;
    } else {
      this.cumplidoSatisfaccionSeleccionado = false;
    }
  }
}
