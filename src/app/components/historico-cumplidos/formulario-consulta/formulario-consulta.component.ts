import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Swal from 'sweetalert2';
import { Month } from 'src/app/models/month.model';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { Cumplido } from 'src/app/models/cumplido';

@Component({
  selector: 'app-formulario-consulta',
  templateUrl: './formulario-consulta.component.html',
  styleUrls: ['./formulario-consulta.component.css'],
})
export class FormularioConsultaComponent implements OnInit {
  @Input() anios: number[] = [];
  @Input() meses: Month[] = [];
  @Input() dependencias: any[] = [];
  @Input() estados: any[] = [];
  @Output() listaCumplidos = new EventEmitter<Cumplido[]>();
  title: string = 'CONSULTA CUMPLIDOS APROBADOS';
  formularioFiltroHistorico!: FormGroup;
  ListaCumplidos: Cumplido[] = [];

  constructor(
    private popUpManager: PopUpManager,
    private fb: FormBuilder,
    private cumplidosMidService: CumplidosProveedoresMidService
  ) {
    this.formularioFiltroHistorico = this.fb.group({
      anios: [[]],
      meses: [[]],
      vigencias: [[]],
      nombres_proveedor: [[]],
      estados: [[]],
      dependencias: [[]],
      numeros_contrato: [[]],
    });
  }

  ngOnInit(): void {}

  async consultar() {
    let peticion = {
      Anios: this.formularioFiltroHistorico.get('anios')?.value,
      Meses: this.formularioFiltroHistorico.get('meses')?.value,
      Vigencias: this.formularioFiltroHistorico.get('vigencias')?.value,
      Proveedores:
        this.formularioFiltroHistorico.get('nombres_proveedor')?.value,
      Estados: this.formularioFiltroHistorico.get('estados')?.value,
      Dependencias: this.formularioFiltroHistorico.get('dependencias')?.value,
      Contratos: this.formularioFiltroHistorico.get('numeros_contrato')?.value,
    };

    this.obtenerListadoHistoricos(peticion);
  }

  async obtenerListadoHistoricos(peticion: any) {
   

   
    this.popUpManager.showLoadingAlert('Buscando');
    this.cumplidosMidService
      .post('/historico-cumplidos/filtro-cumplidos', peticion)
      .subscribe({
        next: (response: any) => {
          this.ListaCumplidos = response.Data.map((cumplido: Cumplido) => {
            return {
              NumeroContrato: cumplido.NumeroContrato,

              Vigencia: cumplido.Vigencia,
              Rp: cumplido.Rp,
              Mes: cumplido.Mes,
              FechaCambioEstado: cumplido.FechaCambioEstado,
              NombreProveedor: cumplido.NombreProveedor,
              Dependencia: cumplido.Dependencia,
              Estado: cumplido.Estado,
              TipoContrato: cumplido.TipoContrato,
              acciones: [
                { icon: 'archive', actionName: 'archive', isActive: true },
                {
                  icon: 'visibility',
                  actionName: 'visibility',
                  isActive: true,
                },
              ],
            };
          });
        },
        error: (error: any) => {
          console.error('Error');
          Swal.close();
        },
        complete: () => {
          this.listaCumplidos.emit(this.ListaCumplidos);
          Swal.close();
        },
      });
  }
}
