import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-listar-contratos-evaluar',
  templateUrl: './listar-contratos-evaluar.component.html',
  styleUrls: ['./listar-contratos-evaluar.component.scss']
})
export class ListarContratosEvaluarComponent {

  tittle!: string;
  filtrosForm!: FormGroup;
  vigencias!: number[];
  dataSource: any[] = [];

  displayedColumns: any[] = [
    {def: 'nombreProveedor', header: 'NOMBRE' },
    {def: 'dependencia', header: 'DEPENDENCIA' },
    {def: 'tipoContrato', header: 'TIPO DE CONTRATO' },
    {def: 'contrato', header: 'CONTRATO' },
    {def: 'vigencia', header: 'VIGENCIA' },
    {
      def: 'acciones',
      header: 'ACCIONES',
      isAction: true,
    }
  ];


  constructor(
    private fb: FormBuilder
  ){
    this.filtrosForm = this.fb.group({
      nombreProveedor: ['', [Validators.minLength(5)]],
      numeroContrato: ['', [Validators.pattern(/^[0-9]+$/)]],
      vigencia: ['', [Validators.pattern(/^[0-9]+$/)]],
    });
  }


  ngOnInit(){
    this.tittle = "Lista Proveedores";
    this.vigencias = this.obtenerListaVigencias();

    this.dataSource = [
      {
        nombreProveedor: 'PROCEDIMENTER',
        dependencia: 'Facultad ingenieria',
        tipoContrato: 'Prestacion de servicios',
        contrato: 1018,
        vigencia: 2022,
        acciones: [
          {
            icon: 'edit',
            actionName: 'edit',
            isActive: true,
          },
          {
            icon: 'visibility',
            actionName: 'visibility',
            isActive: true,
          },
          {
            icon: 'accessibility',
            actionName: 'accessibility',
            isActive: true,
          },
        ],
      },
      {
        nombreProveedor: 'UNIVERSIDAD CENTRAL',
        dependencia: 'Decanatura',
        tipoContrato: 'Indefinido',
        contrato: 1012,
        vigencia: 2024,
        acciones: [
          {
            icon: 'edit',
            actionName: 'edit',
            isActive: true,
          },
          {
            icon: 'visibility',
            actionName: 'visibility',
            isActive: true,
          },
          {
            icon: 'accessibility',
            actionName: 'accessibility',
            isActive: true,
          },
        ],
      },
      {
        nombreProveedor: 'PROCEDIMENTER',
        dependencia: 'Facultad ingenieria',
        tipoContrato: 'Prestacion de servicios',
        contrato: 1018,
        vigencia: 2022,
        acciones: [
          {
            icon: 'edit',
            actionName: 'edit',
            isActive: true,
          },
          {
            icon: 'visibility',
            actionName: 'visibility',
            isActive: true,
          },
          {
            icon: 'accessibility',
            actionName: 'accessibility',
            isActive: true,
          },
        ],
      },
      {
        nombreProveedor: 'UNIVERSIDAD CENTRAL',
        dependencia: 'Decanatura',
        tipoContrato: 'Indefinido',
        contrato: 1012,
        vigencia: 2024,
        acciones: [
          {
            icon: 'edit',
            actionName: 'edit',
            isActive: true,
          },
          {
            icon: 'visibility',
            actionName: 'visibility',
            isActive: true,
          },
          {
            icon: 'accessibility',
            actionName: 'accessibility',
            isActive: true,
          },
        ],
      },
      {
        nombreProveedor: 'PROCEDIMENTER',
        dependencia: 'Facultad ingenieria',
        tipoContrato: 'Prestacion de servicios',
        contrato: 1018,
        vigencia: 2022,
        acciones: [
          {
            icon: 'edit',
            actionName: 'edit',
            isActive: true,
          },
          {
            icon: 'visibility',
            actionName: 'visibility',
            isActive: true,
          },
          {
            icon: 'accessibility',
            actionName: 'accessibility',
            isActive: true,
          },
        ],
      },
      {
        nombreProveedor: 'UNIVERSIDAD CENTRAL',
        dependencia: 'Decanatura',
        tipoContrato: 'Indefinido',
        contrato: 1012,
        vigencia: 2024,
        acciones: [
          {
            icon: 'edit',
            actionName: 'edit',
            isActive: true,
          },
          {
            icon: 'visibility',
            actionName: 'visibility',
            isActive: true,
          },
          {
            icon: 'accessibility',
            actionName: 'accessibility',
            isActive: true,
          },
        ],
      }
    ]
  }

  obtenerListaVigencias() {
    const anioActual = new Date().getFullYear();  // Obtiene el año actual
    const anios = [];

    for (let i = 2017; i <= anioActual; i++) {
        anios.push(i);
    }
    return anios;
  }




}
