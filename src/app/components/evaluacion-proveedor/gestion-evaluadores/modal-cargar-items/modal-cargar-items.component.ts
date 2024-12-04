import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UnidadMedida } from 'src/app/models/unidad-medida';
import { UtilsService } from 'src/app/services/utils.service';
import { EvaluacionCumplidosProveedoresMidService } from 'src/app/services/evaluacion_cumplidos_provedores_mid.service';
import { ModalItemsNoAgregadosComponent } from '../modal-items-no-agregados/modal-items-no-agregados.component';
import { map } from 'rxjs';

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
  excel:File | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef;
  constructor(private fb:FormBuilder,private popUpManager:PopUpManager,private matDialogRef:MatDialogRef<ModalCargarItemsComponent>,private  utilsService:UtilsService,private evaluacionCumplidosMidService:EvaluacionCumplidosProveedoresMidService, private dialog: MatDialog) {
    this.soporteForm = this.fb.group({
      observaciones: ['', [Validators.minLength(10)]],
      fileName: [{ value: '', disabled: true }, [Validators.required]]
    });
  }



  removeFile() {
    this.fileInput.nativeElement.value = '';
    this.fileName = '';
    this.soporteForm.patchValue({ fileName: ''})
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

  cerrarModalCargaExcel(){
    this.matDialogRef.close()
  }
  uploadFile(){
   
    this.enviarExcel()

  }


  enviarExcel(){
    console.log(this.excel instanceof File); 
    if(!this.excel){
      this.popUpManager.showErrorAlert('No ha cargado ningún archivo');
      return;
    }
    const formData = new FormData();
    formData.append('file', this.excel, this.excel.name); 
    
    debugger
    this.evaluacionCumplidosMidService.postCargaExcel("/carga-data-excel/upload",formData).subscribe(
      {next: (res: any) => {
       if(res.Data.itemsNoAgregados.length>0){
       const itemsNoAgregaaados =  res.Data.itemsNoAgregados.map((item:any)=>{
        return {
          id: item.Id,
          nombre: item.Nombre,
          descripcion: item.FichaTecnica,
          cantidad: item.Cantidad,
          valor: item.ValorInitario,
          iva: item.Iva,
          tipoNecesidad: item.TipoNecessidad
      
      }
       })
           this.popUpManager.showSuccessAlert("Algunos elementos se cargaron correctamente, pero otros no se añadieron correctamente.");
        this.removeFile();
        this.matDialogRef.close()
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

       }else{
        this.popUpManager.showSuccessAlert("Se cargaron todos los elementos correctamente");
        this.removeFile();
        this.matDialogRef.close()
        console.log(res.Data.itemsNoAgregados.length>0)
       }

       
  

      },
    error:(errr:any)=>{
      console.log(formData)
      this.popUpManager.showErrorAlert("Error al cargar el  archivo")
    }}

    )



  }
}
