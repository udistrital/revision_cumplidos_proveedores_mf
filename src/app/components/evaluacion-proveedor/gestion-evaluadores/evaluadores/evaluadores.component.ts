import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { Evaluador } from 'src/app/models/evaluador';
import { UnidadMedida } from 'src/app/models/unidad-medida';
import { UtilsService } from 'src/app/services/utils.service';
import { ItemAEvaluar } from './../../../../models/item_a_evaluar';
import { JbpmService } from './../../../../services/jbpm_service.service';
import { PersonaNatural } from 'src/app/models/persona-natural';

@Component({
  selector: 'app-evaluadores',
  templateUrl: './evaluadores.component.html',
  styleUrls: ['./evaluadores.component.scss'],
})
export class EvaluadoresComponent  {
  panelOpenStateItems = true;
  listaEvaluadores: Evaluador[] = [];
  formAddEvaluadores: FormGroup;
  formularioEnviado: boolean = false;
  evaluadres:PersonaNatural[]=[]

  @Input() listaItems:ItemAEvaluar[]=[]
  @Output() porcentaje = new EventEmitter<number>();

  constructor(private fb: FormBuilder, private popUpManager: PopUpManager,private utilsService:UtilsService,private cdr: ChangeDetectorRef,private jbpmService:JbpmService) {
    this.formAddEvaluadores = this.fb.group({
      numero_documento: ['', [Validators.required]],
      cargo: ['', [Validators.required]],
      item_a_evaluar: [[], [Validators.required]],
      porcentaje: ['', [Validators.required]],
    });
  }
  ngOnChanges(changes: SimpleChanges) {
   
    console.log(this.listaItems);
  }




  handleActionClick(event: { action: any; element: any }) {
    if (event.action.actionName === 'delete') {
      this.eliminarEvaluador(event.element.NumeroDocumento);
    }
  }

  async agregarEvaluador() {
    console.log(this.obtenerInfoFormulario())
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

  async eliminarEvaluador(numeroDocumento: number) {
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
      ItemAEvaluar: this.formAddEvaluadores.get('item_a_evaluar')?.getRawValue() ?? [],
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

  async eliminarItem(id: number) {

    let confirm = await this.popUpManager.showConfirmAlert(
      '¿Estás seguro de eliminar el Evaluador?'
    );
    if (confirm.isConfirmed) {
      this.listaEvaluadores = this.listaEvaluadores.filter((evaluador) => evaluador.NumeroDocumento !== id);
    }
    this.porcentaje.emit(this.sumarPorcentaje());
  }


  obtenerEvaluador(event: any){
      const numerodeDocumento = event.target.value;
    this.validarNumero('numero_documento', numerodeDocumento);
    console.log(numerodeDocumento);
    if (numerodeDocumento.length > 3) {
      this.validarNumero('numero_documento', numerodeDocumento);
      return this.jbpmService.get(`/personas_documento/${numerodeDocumento}`).subscribe({
        next: (data) => {
          console.log("Sientrop")
          console.log(data.Personas);
          this.evaluadres=data.Personas;
        }
      });
    }
    return null;
  }


  }
