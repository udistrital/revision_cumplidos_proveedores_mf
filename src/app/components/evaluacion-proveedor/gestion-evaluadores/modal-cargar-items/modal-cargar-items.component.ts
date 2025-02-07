import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UnidadMedida } from 'src/app/models/unidad-medida';
import { UtilsService } from 'src/app/services/utils.service';
import { EvaluacionCumplidosProveedoresMidService } from 'src/app/services/evaluacion_cumplidos_provedores_mid.service';
import { ModalItemsNoAgregadosComponent } from '../modal-items-no-agregados/modal-items-no-agregados.component';
import { map } from 'rxjs';
import { ItemAEvaluar } from 'src/app/models/item_a_evaluar';
import { EvaluacionCumplidoProvCrudService } from 'src/app/services/evaluacion_cumplido_prov_crud';
import { Evaluacion } from 'src/app/models/evaluacion_cumplido_prov_crud/evaluacion.model';
import { plantillaBase64 } from 'src/app/models/plantilla_carga_masiva_items.model';

@Component({
  selector: 'app-modal-cargar-items',
  templateUrl: './modal-cargar-items.component.html',
  styleUrls: ['./modal-cargar-items.component.scss']
})
export class ModalCargarItemsComponent {

  fileName: string = '';
  soporteForm!: FormGroup;
  base64Output: string | ArrayBuffer | null = '';
  archivoSeleccionado: boolean = true;
  excel: File | null = null;
  listaitemsCargados: ItemAEvaluar[] = [];
  evaluacion!: Evaluacion;

  @ViewChild('fileInput') fileInput!: ElementRef;
  constructor(
    private fb: FormBuilder, 
    private popUpManager: PopUpManager, 
    private matDialogRef: MatDialogRef<ModalCargarItemsComponent>, 
    private utilsService: UtilsService, 
    private evaluacionCumplidosMidService: EvaluacionCumplidosProveedoresMidService, 
    private dialog: MatDialog, 
    private evaluacionCumplidoProvCrudService: EvaluacionCumplidoProvCrudService,
  ) {
    this.evaluacionCumplidoProvCrudService.evaluacion$.subscribe((evaluacion) => {
      if (evaluacion) {
        this.evaluacion = evaluacion;
      }
    })
    this.soporteForm = this.fb.group({
      observaciones: ['', [Validators.minLength(10)]],
      fileName: [{ value: '', disabled: true }, [Validators.required]]
    });
  }



  removeFile() {
    this.fileInput.nativeElement.value = '';
    this.fileName = '';
    this.soporteForm.patchValue({ fileName: '' })
    this.base64Output = '';
    this.archivoSeleccionado = false;
  }
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  descargarPlantilla(){
    const byteCharacters = atob(plantillaBase64);
    const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Formato-carga-masiva-de-items.xlsx';
    a.click();

    URL.revokeObjectURL(url);
  }

  async onFileSelected(event: Event) {
    this.archivoSeleccionado = true;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileName = file.name;
      const fileType = file.type;

      if (fileType === 'application/vnd.ms-excel' || fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        this.fileName = fileName;
        this.soporteForm.patchValue({ fileName: this.fileName });
        this.excel = file;

        const reader = new FileReader();
        reader.onload = async () => {
          const base64Result = reader.result as string;
          this.base64Output = base64Result.split(',')[1];
        };

        reader.readAsDataURL(file);
        this.archivoSeleccionado = false;
      } else {
        this.popUpManager.showErrorAlert('Solo se permiten archivos en formato Excel (XLSX o XLS).');
        this.removeFile();
      }
    }
  }

  cerrarModalCargaExcel() {
    const datosAEnviar = { listaitemsCargados: this.listaitemsCargados };
    this.matDialogRef.close(datosAEnviar)
  }


  uploadFile() {

    this.enviarExcel()

  }


  async enviarExcel() {
    if (!this.excel) {
      this.popUpManager.showErrorAlert('No ha cargado ningún archivo');
      return;
    }

    if (!this.evaluacion || !this.evaluacion.Id) {
      this.popUpManager.showErrorAlert('No hay una evaluación creada.');
      return;
    }


    const formData = new FormData();
    formData.append('file', this.excel, this.excel.name);
    formData.append('idEvaluacion', this.evaluacion.Id.toString());

    this.evaluacionCumplidosMidService.postCargaExcel("/carga-data-excel/upload", formData).subscribe(
      {
        next: async (res: any) => {
  
          if (res.Data.itemsNoAgregados && res.Data.itemsNoAgregados.length > 0) {
            const itemsNoAgregaaados = res.Data.itemsNoAgregados.map((item: any) => {
              return {
                Identificador: item.Identificador,
                Nombre: item.Nombre,
                FichaTecnica: item.FichaTecnica,
                Cantidad: item.Cantidad,
                ValorUnitario: item.ValorInitario,
                Iva: item.Iva,
                TipoNecesidad: item.TipoNecesidad

              }
            })
            this.popUpManager.showSuccessAlert("Algunos elementos se cargaron correctamente, pero otros no se añadieron correctamente.");
            this.removeFile();
            await this.cargarItemCargados()
           this.cerrarModalCargaExcel()
            this.dialog.open(ModalItemsNoAgregadosComponent, {
              disableClose: true,
              maxHeight: '80vh',
              maxWidth: '60vw',
              minHeight: '80v',
              minWidth: '60vw',
              height: 'auto',
              width: 'auto',
              data: {
                listaItems: itemsNoAgregaaados
              },
            });

          } else {
            await this.cargarItemCargados()
            this.popUpManager.showSuccessAlert("Se cargaron todos los elementos correctamente");
            this.removeFile();
           this.cerrarModalCargaExcel()
          }


        },
        error: (errr: any) => {
          this.popUpManager.showErrorAlert("Error al cargar el  archivo")
        }
      }

    )



  }


  async cargarItemCargados():Promise<void> {
   return new Promise((resolve, reject) => {
    this.evaluacionCumplidoProvCrudService.get(`/item?query=EvaluacionId:${this.evaluacion.Id}&limit=-1`).subscribe({
      next: (res: any) => {
        this.listaitemsCargados = res.Data.map((item: any) => {
          return {
            Identificador: item.Identificador,
            Nombre: item.Nombre,
            FichaTecnica: item.FichaTecnica,
            Cantidad: item.Cantidad,
            ValorUnitario: item.ValorUnitario,
            Iva: item.Iva,
            TipoNecesidad: item.TipoNecesidad,
            acciones: [{ icon: 'delete', actionName: 'delete', isActive: true }],

          }
        })
        resolve()
      },
      error: (err: any) => {
        this.popUpManager.showErrorAlert("Error Consular los items")
      },
    })
   })

  }

}
