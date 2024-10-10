import { Component, OnInit } from '@angular/core';
import { Month } from 'src/app/models/month.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-historico-cumplidos',
  templateUrl: './historico-cumplidos.component.html',
  styleUrls: ['./historico-cumplidos.component.css'],
})
export class HistoricoCumplidosComponent implements OnInit {
  constructor(private utilsService: UtilsService) {}
  anios: number[] = [];
  meses: Month[] = [];
  dependencias: any[] = [];
  estados: any[] = [];

  displayedColumns = [
    { def: 'numeroContrato', header: 'N° CONTRATO' },
    { def: 'vigencia', header: 'VIGENCIA' },
    { def: 'rp', header: 'RP' },
    { def: 'mes', header: 'Mes ' },
    { def: 'fechaAprobacion', header: 'FECHA APROBACION' },
    { def: 'nombreProveedor', header: 'PROVEEDOR' },
    { def: 'dependencias', header: 'DEPENDENCIA' },
    { def: 'acciones', header: 'ACCIONES', isAction: true },
  ];


  dataSource:any[]=[]
  ngOnInit(): void {
    this.anios = this.utilsService.obternerAnios();
    this.meses = this.utilsService.obtenerMeses();
    this.estados=["Aprobado", "Rechazado"]
    this.dependencias=["Test1", "Test"]
  }


 listaHistoricos=[
  {
    numeroContrato: '12345',
    vigencia: '2024-01-01',
    rp: 'John Doe',
    mes: 'Enero',
    fechaAprobacion: new Date('2024-01-15'),
    nombreProveedor: 'Proveedor XYZ',
    dependencias: 'Dependencia A',
    acciones: [
      { icon: 'archive', actionName: 'archive', isActive: true },
      {
        icon: 'visibility',
        actionName: 'visibility',
        isActive: true,
      },
    ],
    
  },
  {
    numeroContrato: '67890',
    vigencia: '2024-01-01',
    rp: 'Jane Smith',
    mes: 'Junio',
    fechaAprobacion: new Date('2024-06-10'),
    nombreProveedor: 'Proveedor ABC',
    dependencias: 'Dependencia B',
    acciones: [
      { icon: 'archive', actionName: 'archive', isActive: true },
      {
        icon: 'visibility',
        actionName: 'visibility',
        isActive: true,
      },
    ],
  },
  {
    numeroContrato: '11223',
    vigencia: '2024-02-01',
    rp: 'Alice Brown',
    mes: 'Febrero',
    fechaAprobacion: new Date('2024-02-20'),
    nombreProveedor: 'Proveedor DEF',
    dependencias: 'Dependencia C',
    acciones: [
      { icon: 'archive', actionName: 'archive', isActive: true },
      {
        icon: 'visibility',
        actionName: 'visibility',
        isActive: true,
      },
    ],
  },
  {
    numeroContrato: '44556',
    vigencia: '2024-03-01',
    rp: 'Bob Johnson',
    mes: 'Marzo',
    fechaAprobacion: new Date('2024-03-12'),
    nombreProveedor: 'Proveedor GHI',
    dependencias: 'Dependencia D',
    acciones: [
      { icon: 'archive', actionName: 'archive', isActive: true },
      {
        icon: 'visibility',
        actionName: 'visibility',
        isActive: true,
      },
    ],
  },
  {
    numeroContrato: '77889',
    vigencia: '2024-04-01',
    rp: 'Charlie Davis',
    mes: 'Abril',
    fechaAprobacion: new Date('2024-04-05'),
    nombreProveedor: 'Proveedor JKL',
    dependencias: 'Dependencia E',
    acciones: [
      { icon: 'archive', actionName: 'archive', isActive: true },
      {
        icon: 'visibility',
        actionName: 'visibility',
        isActive: true,
      },
    ],
  },
  {
    numeroContrato: '99001',
    vigencia: '2024-05-01',
    rp: 'Diana Evans',
    mes: 'Mayo',
    fechaAprobacion: new Date('2024-05-25'),
    nombreProveedor: 'Proveedor MNO',
    dependencias: 'Dependencia F',
    acciones: [
      { icon: 'archive', actionName: 'archive', isActive: true },
      {
        icon: 'visibility',
        actionName: 'visibility',
        isActive: true,
      },
    ],
  },
  {
    numeroContrato: '22334',
    vigencia: '2024-06-01',
    rp: 'Ethan Green',
    mes: 'Junio',
    fechaAprobacion: new Date('2024-06-15'),
    nombreProveedor: 'Proveedor PQR',
    dependencias: 'Dependencia G',
    acciones: [
      { icon: 'archive', actionName: 'archive', isActive: true },
      {
        icon: 'visibility',
        actionName: 'visibility',
        isActive: true,
      },
    ],
  },
  {
    numeroContrato: '55667',
    vigencia: '2024-07-01',
    rp: 'Fiona Harris',
    mes: 'Julio',
    fechaAprobacion: new Date('2024-07-30'),
    nombreProveedor: 'Proveedor STU',
    dependencias: 'Dependencia H',
    acciones: [
      { icon: 'archive', actionName: 'archive', isActive: true },
      {
        icon: 'visibility',
        actionName: 'visibility',
        isActive: true,
      },
    ],
  },
  {
    numeroContrato: '88990',
    vigencia: '2024-08-01',
    rp: 'George Ives',
    mes: 'Agosto',
    fechaAprobacion: new Date('2024-08-12'),
    nombreProveedor: 'Proveedor VWX',
    dependencias: 'Dependencia I',
    acciones: [
      { icon: 'archive', actionName: 'archive', isActive: true },
      {
        icon: 'visibility',
        actionName: 'visibility',
        isActive: true,
      },
    ],
  },
  {
    numeroContrato: '33445',
    vigencia: '2024-09-01',
    rp: 'Hannah Jones',
    mes: 'Septiembre',
    fechaAprobacion: new Date('2024-09-20'),
    nombreProveedor: 'Proveedor YZA',
    dependencias: 'Dependencia J',
    acciones: [
      { icon: 'archive', actionName: 'archive', isActive: true },
      {
        icon: 'visibility',
        actionName: 'visibility',
        isActive: true,
      },
    ],
  },
  {
    numeroContrato: '66789',
    vigencia: '2024-10-01',
    rp: 'Ian King',
    mes: 'Octubre',
    fechaAprobacion: new Date('2024-10-05'),
    nombreProveedor: 'Proveedor BCD',
    dependencias: 'Dependencia K',
    acciones: [
      { icon: 'archive', actionName: 'archive', isActive: true },
      {
        icon: 'visibility',
        actionName: 'visibility',
        isActive: true,
      },
    ],
  },
  {
    numeroContrato: '99012',
    vigencia: '2024-11-01',
    rp: 'Julia Lee',
    mes: 'Noviembre',
    fechaAprobacion: new Date('2024-11-15'),
    nombreProveedor: 'Proveedor EFG',
    dependencias: 'Dependencia L',
    acciones: [
      { icon: 'archive', actionName: 'archive', isActive: true },
      {
        icon: 'visibility',
        actionName: 'visibility',
        isActive: true,
      },
    ],
  },
  {
    numeroContrato: '22345',
    vigencia: '2024-12-01',
    rp: 'Kevin Miller',
    mes: 'Diciembre',
    fechaAprobacion: new Date('2024-12-22'),
    nombreProveedor: 'Proveedor HIJ',
    dependencias: 'Dependencia M',
    acciones: [
      { icon: 'archive', actionName: 'archive', isActive: true },
      {
        icon: 'visibility',
        actionName: 'visibility',
        isActive: true,
      },
    ],
  },
  {
    numeroContrato: '55678',
    vigencia: '2025-01-01',
    rp: 'Laura Nelson',
    mes: 'Enero',
    fechaAprobacion: new Date('2025-01-10'),
    nombreProveedor: 'Proveedor KLM',
    dependencias: 'Dependencia N',
    acciones: [
      { icon: 'archive', actionName: 'archive', isActive: true },
      {
        icon: 'visibility',
        actionName: 'visibility',
        isActive: true,
      },
    ],
  },
  {
    numeroContrato: '88901',
    vigencia: '2025-02-01',
    rp: "Mike O'Connor",
    mes: 'Febrero',
    fechaAprobacion: new Date('2025-02-28'),
    nombreProveedor: 'Proveedor NOP',
    dependencias: 'Dependencia O',
    acciones: [
      { icon: 'archive', actionName: 'archive', isActive: true },
      {
        icon: 'visibility',
        actionName: 'visibility',
        isActive: true,
      },
    ],
  },
  {
    numeroContrato: '33456',
    vigencia: '2025-03-01',
    rp: 'Nina Parker',
    mes: 'Marzo',
    fechaAprobacion: new Date('2025-03-15'),
    nombreProveedor: 'Proveedor QRS',
    dependencias: 'Dependencia P',
    acciones: [
      { icon: 'archive', actionName: 'archive', isActive: true },
      {
        icon: 'visibility',
        actionName: 'visibility',
        isActive: true,
      },
    ],
  },
  {
    numeroContrato: '66789',
    vigencia: '2025-04-01',
    rp: 'Oscar Quinn',
    mes: 'Abril',
    fechaAprobacion: new Date('2025-04-10'),
    nombreProveedor: 'Proveedor TUV',
    dependencias: 'Dependencia Q',
    acciones: [
      { icon: 'archive', actionName: 'archive', isActive: true },
      {
        icon: 'visibility',
        actionName: 'visibility',
        isActive: true,
      },
    ],
  },
  {
    numeroContrato: '99023',
    vigencia: '2025-05-01',
    rp: 'Paula Roberts',
    mes: 'Mayo',
    fechaAprobacion: new Date('2025-05-05'),
    nombreProveedor: 'Proveedor WXY',
    dependencias: 'Dependencia R',
    acciones: [
      { icon: 'archive', actionName: 'archive', isActive: true },
      {
        icon: 'visibility',
        actionName: 'visibility',
        isActive: true,
      },
    ],
  },
  {
    numeroContrato: '22356',
    vigencia: '2025-06-01',
    rp: 'Quinn Smith',
    mes: 'Junio',
    fechaAprobacion: new Date('2025-06-20'),
    nombreProveedor: 'Proveedor YZA',
    dependencias: 'Dependencia S',
    acciones: [
      { icon: 'archive', actionName: 'archive', isActive: true },
      {
        icon: 'visibility',
        actionName: 'visibility',
        isActive: true,
      },
    ],
  },
  {
    numeroContrato: '55679',
    vigencia: '2025-07-01',
    rp: 'Rachel Taylor',
    mes: 'Julio',
    fechaAprobacion: new Date('2025-07-15'),
    nombreProveedor: 'Proveedor ABC',
    dependencias: 'Dependencia T',
    acciones: [
      { icon: 'archive', actionName: 'archive', isActive: true },
      {
        icon: 'visibility',
        actionName: 'visibility',
        isActive: true,
      },
    ],
  },
  {
    numeroContrato: '88912',
    vigencia: '2025-08-01',
    rp: 'Steve Underwood',
    mes: 'Agosto',
    fechaAprobacion: new Date('2025-08-10'),
    nombreProveedor: 'Proveedor DEF',
    dependencias: 'Dependencia U',
    acciones: [
      { icon: 'archive', actionName: 'archive', isActive: true },
      {
        icon: 'visibility',
        actionName: 'visibility',
        isActive: true,
      },
    ],
  },
 ]
}
