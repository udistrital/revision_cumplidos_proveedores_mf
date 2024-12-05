import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { InformacionContratoEvaluacion } from 'src/app/models/informacion-contrato-evaluacion';

@Component({
  selector: 'app-informacion-general',
  templateUrl: './informacion-general.component.html',
  styleUrls: ['./informacion-general.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformacionGeneralComponent {

  tittle!: string;
  informacionGeneral!: InformacionContratoEvaluacion;
  readonly panelOpenState = signal(false);

  ngOnInit(){
    this.tittle = "Información General"
    this.informacionGeneral = {
      puntajeTotalEvaluacion: 20,
      calificacion: 88,
      dependenciaEvaluadora: "Centro de investigaciones y desarrollo científico",
      fechaEvaluacion: new Date(),
      nombreEvaluador: "Parrado Rosselli Angela",
      cargo: "Director centro de investigación y desarrollo científico",
      proveedor: "Proceditor Ltda",
      objetoContrato: "Realizar la corrección de estilo de los libros resultados de los proyectos de investigación financiados e " +
                      "institucionalizados por el centro de investigaciones y desarrollo científico-CIDC de la universidad distrital Francisco " +
                      "José de Caldas"
    };
  }

}
