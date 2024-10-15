import { Component, ElementRef, ViewChild, Output, EventEmitter, Input, numberAttribute } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-soporte',
  templateUrl: './form-soporte.component.html',
  styleUrls: ['./form-soporte.component.scss']
})
export class FormSoporteComponent {

  opciones!:any;
  observaciones = "";
  base64Output: string | ArrayBuffer | null = '';
  fileName: string = '';
  idTipoDocumento!: number;
  cumplidoSatisfaccionSeleccionado: boolean = false;
  soporteForm!: FormGroup;
  itemId!: number;

  @Input({required:true,transform:numberAttribute})cumplidoProveedorId!:number
  @Output() recargarSoportes = new EventEmitter<any>();
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private cumplidosMidServices: CumplidosProveedoresMidService,
    private popUpManager: PopUpManager,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder
  ){

    this.soporteForm = this.fb.group({
      opcionSeleccionada: ['', [Validators.required]],
      observaciones: ['', [Validators.minLength(10)]],
      fileName: [{ value: '', disabled: true }, [Validators.required]]
    });
  }


  ngOnInit(){
    console.log(this.soporteForm.value.opcionSeleccionada)
    this.getTipoDocumentosCumplido()

  }

  getTipoDocumentosCumplido(){
    this.cumplidosMidServices.get('/supervisor/tipos-documentos-cumplido')
    .subscribe({
      next: (res: any) => {
        this.opciones = res.Data;
        console.log("Tipo documentos:", this.opciones)
      },
      error: (error: any) => {
        this.popUpManager.showErrorAlert(
          'No fue posible obtener los documentos que se pueden subir en el cumplido.'
        );
      }
    })
  }

  onFileSelected(event: Event) {
    console.log(this.soporteForm.value.opcionSeleccionada)
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type === 'application/pdf') {
        this.fileName = file.name;
        this.soporteForm.patchValue({ fileName: this.fileName })
        const reader = new FileReader();
        reader.onload = () => {
          const base64Result = reader.result as string;
          // Remove the prefix 'data:application/pdf;base64,'
          const base64Prefix = 'data:application/pdf;base64,';
          this.base64Output = base64Result.startsWith(base64Prefix) ? base64Result.slice(base64Prefix.length) : base64Result;
        };
        reader.readAsDataURL(file);
      } else {
        this.popUpManager.showErrorAlert(
          'Solo se permiten archivos en formato PDF.'
        );
        this.removeFile();
      }
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  removeFile() {
    this.fileInput.nativeElement.value = '';
    this.fileName = '';
    this.soporteForm.patchValue({ fileName: ''})
    this.base64Output = '';
  }

  uploadFile() {
    if (this.base64Output) {
      const payload = {
        SolicitudPagoID: this.cumplidoProveedorId,
        TipoDocumento: "application/pdf",
        observaciones: this.soporteForm.value.observaciones.trim(),
        ItemID: this.itemId,
        NombreArchivo: this.fileName,
        Archivo: this.base64Output
      };
      if(payload.observaciones==""){
        payload.observaciones="Sin observaciónes en el documento"
      }
      this.popUpManager.showLoadingAlert("Cargando documento, por favor espera")
      this.cumplidosMidServices.post('/solicitud-pago/soportes', payload)
        .subscribe({
          next: (res: any) => {
            this.recargarSoportes.emit(res)
          
          },
          error: (error: any) => {
            this.popUpManager.showErrorAlert(
              'Error al intentar cargar el archivo.'
            );
          },complete:()=>{
            this.removeFile();
            Swal.close()
            this.popUpManager.showSuccessAlert(
              'El archivo se ha cargado exitosamente.'
            );
          }
        });
    } else {
      this.popUpManager.showErrorAlert(
        'No se ha seleccionado ningún archivo.'
      );
    }
  }

  asignarItemId(item: number){
    this.itemId = item
    console.log("Itemid:", this.itemId)
  }

  crearDocumento() {
    console.log(this.soporteForm.value.opcionSeleccionada)
    this.dialog.closeAll();
    this.router.navigate(['/informe-seguimiento',this.cumplidoProveedorId]);
  }

  cambioTipoDocumento(tipoDocumento: string){
    if (tipoDocumento === "IS"){
      this.cumplidoSatisfaccionSeleccionado = true
    } else {
      this.cumplidoSatisfaccionSeleccionado = false
    }
  }
}
