import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { MatDialogRef } from '@angular/material/dialog';
import { UnidadMedida } from 'src/app/models/unidad-medida';
import { UtilsService } from 'src/app/services/utils.service';
import { EvaluacionCumplidosProveedoresMidService } from 'src/app/services/evaluacion_cumplidos_provedores_mid.service';

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
  constructor(private fb:FormBuilder,private popUpManager:PopUpManager,private matDialogRef:MatDialogRef<ModalCargarItemsComponent>,private  utilsService:UtilsService,private evaluacionCumplidosMidService:EvaluacionCumplidosProveedoresMidService) {
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
        this.popUpManager.showSuccessAlert("Se ha cargado el archivo correctamente")
        this.removeFile();
        this.matDialogRef.close()
      },
    error:(errr:any)=>{
      console.log(formData)
      this.popUpManager.showErrorAlert("Error al cargar el  archivo")
    }}

    )



  }
}
