import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";

@Component({
  selector: 'app-formulario-informe-seguimiento',
  templateUrl: './formulario-informe-seguimiento.component.html',
  styleUrls: ['./formulario-informe-seguimiento.component.css']
})
export class FormularioInformeSeguimientoComponent implements OnInit {

  formularioInformeSeguimiento!: FormGroup;

  constructor(private fg: FormBuilder) {}

  ngOnInit() {
    this.formularioInformeSeguimiento = this.fg.group({
      "tipo_pago": new FormControl("", Validators.required),
      "anio_inicio": "",
      "periodo_inicio": "",
      "anio_fin": "",
      "periodo_fin": "",
      "cuenta_cobro": "",
      "numero_cuenta": new FormControl("", {
        validators: [Validators.required, Validators.pattern('^[0-9]*$')],
      }),
      "valor_pagar":"",
      "tipo_cuenta": new FormControl("", Validators.required),
      "visualizar_numero_cuenta": new FormControl("", {
        validators: [Validators.required, Validators.pattern('^[0-9]*$')],
      }),
      "banco": new FormControl("", {
        validators: [Validators.required, Validators.pattern(/^(?! )[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+(?<! )$/)],
      })
    });

    this.populateYears();
  }

  tipos_pago = [
    { id: 1, nombre: "Parcial" },
    { id: 2, nombre: "Unico" },
    { id: 3, nombre: "Totalmente" },
  ];

  tipos_cuenta = [
    { id: 1, nombre: "Ahorros" },
    { id: 2, nombre: "Corriente" },
  ];

  periodos = [
    { id: 1, nombre: "I" },
    { id: 2, nombre: "II" },
    { id: 3, nombre: "III" },
  ];

  cuentas_cobro = [
    {id: 1, nombre:"Factura electronica de venta"},
    {id: 2, nombre: "Cuenta de cobro"}
  ];

  // Años desde el 2017 hasta el año actual
  anios: number[] = [];
  anio_actual = new Date().getFullYear();
  anio_inicial = 2017;

  private populateYears() {
    for (let year = this.anio_inicial; year <= this.anio_actual; year++) {
      this.anios.push(year);
    }
  }

  submitFormularioInformeSeguimiento(){
    if(this.formularioInformeSeguimiento.valid){
      console.log(this.formularioInformeSeguimiento.value);
    }else{
      console.log("verificar formulario");
    }
  }

}
