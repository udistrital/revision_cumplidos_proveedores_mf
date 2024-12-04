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
import { EvaluacionCumplidosProveedoresCrudService } from 'src/app/services/evaluacion_cumplidos_provedores_crud.service';

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
  listaitemsCargados: ItemAEvaluar[] = []

  @ViewChild('fileInput') fileInput!: ElementRef;
  constructor(private fb: FormBuilder, private popUpManager: PopUpManager, private matDialogRef: MatDialogRef<ModalCargarItemsComponent>, private utilsService: UtilsService, private evaluacionCumplidosMidService: EvaluacionCumplidosProveedoresMidService, private dialog: MatDialog, private evaluacionCumplidosCrudService: EvaluacionCumplidosProveedoresCrudService) {
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
    this.archivoSeleccionado = true;
  }
  triggerFileInput() {
    this.fileInput.nativeElement.click();
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
    const formData = new FormData();
    formData.append('file', this.excel, this.excel.name);

    this.evaluacionCumplidosMidService.postCargaExcel("/carga-data-excel/upload", formData).subscribe(
      {
        next: async (res: any) => {
  
          if (res.Data.itemsNoAgregados &&res.Data.itemsNoAgregados.length > 0) {
            const itemsNoAgregaaados = res.Data.itemsNoAgregados.map((item: any) => {
    
              return {
                id: item.Identificador,
                nombre: item.Nombre,
                descripcion: item.FichaTecnica,
                cantidad: item.Cantidad,
                valor: item.ValorInitario,
                iva: item.Iva,
                tipoNecesidad: item.TipoNecesidad

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
          console.log(formData)
          this.popUpManager.showErrorAlert("Error al cargar el  archivo")
        }
      }

    )



  }


  async cargarItemCargados():Promise<void> {
   return new Promise((resolve, reject) => {
    this.evaluacionCumplidosCrudService.get('/item?query=EvaluacionId:1&limit=-1').subscribe({
      next: (res: any) => {
        this.listaitemsCargados = res.Data.map((item: any) => {
          return {
            id: item.Id,
            nombre: item.Nombre,
            descripcion: item.FichaTecnica,
            cantidad: item.Cantidad,
            valor: item.ValorUnitario,
            iva: item.Iva,
            tipoNecesidad: item.TipoNecesidad,
            acciones: [{ icon: 'delete', actionName: 'delete', isActive: true }],

          }
        })
        console.log(this.listaitemsCargados)
        resolve()
      },
      error: (err: any) => {
        this.popUpManager.showErrorAlert("Error Consular los items")
      },
    })
   })

  }

}
