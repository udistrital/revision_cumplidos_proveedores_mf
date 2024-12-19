import { Component, signal, ChangeDetectionStrategy, Input } from '@angular/core';
import { InformacionGeneralEvaluacion } from 'src/app/models/informacion_general_evaluacion.model';

@Component({
  selector: 'app-informacion-general',
  templateUrl: './informacion-general.component.html',
  styleUrls: ['./informacion-general.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformacionGeneralComponent {

  tittle!: string;
  @Input({required:true}) informacionGeneral!: InformacionGeneralEvaluacion;
  readonly panelOpenState = signal(false);

  ngOnInit(){
    this.tittle = "Información General"
  }

}
