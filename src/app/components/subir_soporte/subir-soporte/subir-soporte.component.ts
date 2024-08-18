import { Component, ViewChild, ElementRef } from '@angular/core';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { SoportesServicesService } from 'src/app/services/soportes.services.service';
import { Soporte } from 'src/app/models/soporte.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-subir-soporte',
  templateUrl: './subir-soporte.component.html',
  styleUrls: ['./subir-soporte.component.css']
})
export class SubirSoporteComponent {


  opcionSeleccionada!: any;
  opciones!:any;
  observaciones = "";
  base64Output: string | ArrayBuffer | null = '';
  fileName: string = '';
  idTipoDocumento!: number;
  solicitudPago!: number;
  soportes: Soporte[] = []

  @ViewChild('fileInput') fileInput!: ElementRef;


  constructor(
    private cumplidosMidServices: CumplidosProveedoresMidService,
    private popUpManager: PopUpManager,
    private soporteService: SoportesServicesService,
    private router: Router,
    private dialog: MatDialog
  ){

  }

  ngOnInit() {

    this.getTipoDocumentosCumplido();
    this.cumplidosMidServices.cumplido$.subscribe(cumplido => {
      if (cumplido) {
        this.solicitudPago = cumplido.cumplidoProveedor.Id;
      }
    })

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

  cargarSoportes(cumplido_proveedor: number) {
    this.soporteService.getDocumentosCumplidos(cumplido_proveedor)
      .subscribe({
        next: (soportes: Soporte[]) => {
          this.soportes = soportes;
        },
        error: (error: any) => {
          this.popUpManager.showAlert('Solicitud pago sin soportes','Por el momento no se han cargado documentos a esta solicitud de pago');
        }
      });
  }

  uploadFile() {
    if (this.base64Output) {
      const payload = {
        SolicitudPagoID: this.solicitudPago,
        TipoDocumento: "application/pdf",
        observaciones: this.observaciones,
        ItemID: Number(this.opcionSeleccionada),
        NombreArchivo: this.fileName,
        Archivo: this.base64Output
      };
      this.cumplidosMidServices.post('/solicitud-pago/soportes', payload)
        .subscribe({
          next: (res: any) => {
            this.popUpManager.showSuccessAlert('Archivo cargado exitosamente');
          },
          error: (error: any) => {
            this.popUpManager.showErrorAlert('Error al cargar el archivo');
          }
        });
    } else {
      this.popUpManager.showErrorAlert('No se ha seleccionado ningún archivo');
    }
    this.cargarSoportes(this.solicitudPago);
  }

  crearDocumento() {
    this.dialog.closeAll();
    this.router.navigate(['/informe-seguimiento',this.solicitudPago]);
  }


}
