import { Component, ElementRef, ViewChild, Output, EventEmitter, Input, numberAttribute } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { SoportesService } from 'src/app/services/soportes.service';

@Component({
  selector: 'app-form-soporte',
  templateUrl: './form-soporte.component.html',
  styleUrls: ['./form-soporte.component.css']
})
export class FormSoporteComponent {

  opcionSeleccionada:number=0;
  opciones!:any;
  observaciones = "";
  base64Output: string | ArrayBuffer | null = '';
  fileName: string = '';
  idTipoDocumento!: number;
  
  @Input({required:true,transform:numberAttribute})cumplidoProveedorId!:number
  @Output() recargarSoportes = new EventEmitter<any>();
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private cumplidosMidServices: CumplidosProveedoresMidService,
    private popUpManager: PopUpManager,
    private router: Router,
    private dialog: MatDialog
  ){

  }

  ngOnInit(){
    console.log(this.opcionSeleccionada)
    this.getTipoDocumentosCumplido()
  }

  getTipoDocumentosCumplido(){
    this.cumplidosMidServices.get('/supervisor/tipos-documentos-cumplido')
    .subscribe({
      next: (res: any) => {
        this.opciones = res.Data;
      },
      error: (error: any) => {
        this.popUpManager.showErrorAlert('No fue posible obtener los documentos posibles a subir en el cumplido')
      }
    })
  }

  onFileSelected(event: Event) {
    console.log(this.opcionSeleccionada)
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type === 'application/pdf') {
        this.fileName = file.name;
        const reader = new FileReader();
        reader.onload = () => {
          const base64Result = reader.result as string;
          // Remove the prefix 'data:application/pdf;base64,'
          const base64Prefix = 'data:application/pdf;base64,';
          this.base64Output = base64Result.startsWith(base64Prefix) ? base64Result.slice(base64Prefix.length) : base64Result;
        };
        reader.readAsDataURL(file);
      } else {
        this.popUpManager.showErrorAlert('Solo se permiten archivos PDF');
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
    this.base64Output = '';
  }

  uploadFile() {
    if (this.base64Output) {
      const payload = {
        SolicitudPagoID: this.cumplidoProveedorId,
        TipoDocumento: "application/pdf",
        observaciones: this.observaciones,
        ItemID: Number(this.opcionSeleccionada),
        NombreArchivo: this.fileName,
        Archivo: this.base64Output
      };
      this.cumplidosMidServices.post('/solicitud-pago/soportes', payload)
        .subscribe({
          next: (res: any) => {
            this.recargarSoportes.emit(res)
            this.popUpManager.showSuccessAlert('Archivo cargado exitosamente');
          },
          error: (error: any) => {
            this.popUpManager.showErrorAlert('Error al cargar el archivo');
          }
        });
    } else {
      this.popUpManager.showErrorAlert('No se ha seleccionado ningún archivo');
    }
  }

  crearDocumento() {
    console.log(this.opcionSeleccionada)
    this.dialog.closeAll();
    this.router.navigate(['/informe-seguimiento',this.cumplidoProveedorId]);
  }
}
