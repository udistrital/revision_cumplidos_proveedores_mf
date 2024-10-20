import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { Evaluador } from 'src/app/models/evaluador';

@Component({
  selector: 'app-evaluadores',
  templateUrl: './evaluadores.component.html',
  styleUrls: ['./evaluadores.component.scss'],
})
export class EvaluadoresComponent {
  panelOpenStateItems = true;
  listaEvaluadores: Evaluador[] = [];
  formAddEvaluadores: FormGroup;
  formularioEnviado: boolean = false;
  @Output() porcentaje = new EventEmitter<number>();
  displayedColumns = [
    { def: 'NumeroDocumento', header: 'N° Documento' },
    { def: 'Cargo', header: 'Cargo' },
    { def: 'ItemAEvaluar', header: 'Items a evaluar' },
    { def: 'PorcentageDeEvaluacion', header: 'Porcentage de evaluacion' },
    { def: 'acciones', header: 'ACCIONES', isAction: true },
  ];

  constructor(private fb: FormBuilder, private popUpManager: PopUpManager) {
    this.formAddEvaluadores = this.fb.group({
      numero_documento: ['', [Validators.required]],
      cargo: ['', [Validators.required]],
      item_a_evaluar: ['', [Validators.required]],
      porcentaje: ['', [Validators.required]],
    });
  }

  handleActionClick(event: { action: any; element: any }) {
    if (event.action.actionName === 'delete') {
      this.eliminarEvaluador(event.element.NumeroDocumento);
    }
  }

  async agregarEvaluador() {
    if (this.validarFromulario()) {
      const existe = this.listaEvaluadores.some(
        (item) =>
          item.NumeroDocumento === this.obtenerInfoFormulario().NumeroDocumento
      );

      if (existe) {
        this.popUpManager.showErrorAlert('El Documento ya existe');
      } else {
        let confirm = await this.popUpManager.showConfirmAlert(
          '¿Estás seguro de agregar el ítem?'
        );
        if (confirm.isConfirmed) {
          if (
            this.sumarPorcentaje() +
              Number(this.obtenerInfoFormulario().PorcentageDeEvaluacion) >
            100
          ) {
            this.popUpManager.showErrorAlert(
              'La suma de porcentajes no puede superar el 100%'
            );
          } else {
            this.formularioEnviado = true;
            this.listaEvaluadores = [
              ...this.listaEvaluadores,
              this.obtenerInfoFormulario(),
            ];
            this.porcentaje.emit(this.sumarPorcentaje());
            this.formAddEvaluadores.reset();
            this.formularioEnviado = false;
          }
        }
      }
    } else {
      this.popUpManager.showErrorAlert('Verifica los campos');
    }
  }

  async eliminarEvaluador(numeroDocumento: string) {
    let confirm = await this.popUpManager.showConfirmAlert(
      '¿Estás seguro de eliminar el Evaluador?'
    );
    if (confirm.isConfirmed) {
      this.listaEvaluadores = this.listaEvaluadores.filter(
        (item) => item.NumeroDocumento !== numeroDocumento
      );
    }

  }

  obtenerInfoFormulario() {
    let nuevoEvaludor: Evaluador = {
      NumeroDocumento:
        this.formAddEvaluadores.get('numero_documento')?.getRawValue() ?? '',
      Cargo: this.formAddEvaluadores.get('cargo')?.getRawValue() ?? '',
      ItemAEvaluar:
        this.formAddEvaluadores.get('item_a_evaluar')?.getRawValue() ?? '',
      PorcentageDeEvaluacion:
        this.formAddEvaluadores.get('porcentaje')?.getRawValue() ?? '',
      acciones: [{ icon: 'delete', actionName: 'delete', isActive: true }],
    };
    return nuevoEvaludor;
  }

  validarFromulario(): boolean {
    let isValid = true;

    const controls = this.formAddEvaluadores.controls;
    for (const control in controls) {
      if (controls[control].invalid) {
        controls[control].markAsTouched();
        isValid = false;
        this.formularioEnviado = true;
      }
    }

    return isValid;
  }

  validarNumero(nombre: any, value: any): void {
    const control = this.formAddEvaluadores.get(nombre);

    if (control) {
      if (/[a-zA-Z]/.test(value.data)) {
        control.setValue(control.value.replace(/[^0-9]/g, ''));
      }
    }
  }

  sumarPorcentaje() {
    let suma = 0;
    this.listaEvaluadores.forEach((evaluador) => {
      suma += Number(evaluador.PorcentageDeEvaluacion);
    });
    return suma;
  }
}
