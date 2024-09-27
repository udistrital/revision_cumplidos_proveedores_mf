import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { BodyComentarioSoporte } from 'src/app/models/revision_cumplidos_proveedores_mid/body_comentario_soporte.model';
import { CumplidosProveedoresCrudService } from 'src/app/services/cumplidos_proveedores_crud.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ConfigSoportes } from 'src/app/models/modal-soporte-cumplido-data.model';

@Component({
  selector: 'app-generar-comentario-soporte',
  templateUrl: './generar-comentario-soporte.component.html',
  styleUrls: ['./generar-comentario-soporte.component.scss']
})
export class GenerarComentarioSoporteComponent {

  comentarioForm!: FormGroup;
  @Input() cambioEstadoId!: number;
  @Input() soporteCumplidoId!: number;
  @Output() nuevoComentarioCreado = new EventEmitter<void>();

  constructor(
    private cumplidos_provedore_crud_service:CumplidosProveedoresCrudService,
    private popUpManager: PopUpManager,
    private fb: FormBuilder
  ){
    this.comentarioForm = this.fb.group({
      comentario : ['', [Validators.required, Validators.minLength(10), this.validacionComentarioVacio]]
    })

  }

  validacionComentarioVacio(control: AbstractControl ): ValidationErrors | null{
    const cadena = control.value;
    if(cadena.trim() === ''){
      return { comentarioVacio: true };
    }
    return null;
  }

  getErrorMessage() {
    const comentarioControl = this.comentarioForm.get('comentario');
    if (comentarioControl?.hasError('required')) {
      return 'El comentario es requerido';
    } else if (comentarioControl?.hasError('minlength')) {
      return 'El comentario debe tener al menos 10 caracteres';
    }
    return comentarioControl?.hasError('comentarioVacio') ? 'El comentario no puede estar vacío' : '';
  }

  registrarComentarioSoporte(){
    var newComentario: BodyComentarioSoporte = {
      comentario: this.comentarioForm.value.comentario.trim(),
      CambioEstadoCumplidoId: {
        id: this.cambioEstadoId
      },
      SoporteCumplidoId: {
        id: this.soporteCumplidoId
      }
    };

    this.cumplidos_provedore_crud_service.post('/comentario_soporte', newComentario).subscribe({
      next: (response) => {
        this.popUpManager.showSuccessAlert('El comentario se ha registrado correctamente');
        this.nuevoComentarioCreado.emit();
        this.comentarioForm.reset({
          comentario: ''
        });
        this.comentarioForm.get('comentario')?.setValue('');
      },
      error: (error: any) => {
        this.popUpManager.showErrorAlert('Error al registrar el comentario');
      }
    });



  }
}
