import { EvaluacionCumplidoProvMidService } from './../../../services/evaluacion_cumplido_prov_mid';
import { Component, signal, SimpleChanges } from '@angular/core';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { Evaluador } from 'src/app/models/evaluador.model';
import { ItemAEvaluar } from 'src/app/models/item_a_evaluar';
import { Evaluacion } from 'src/app/models/evaluacion_cumplidos_proiveedores_crud/evaluacion';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/services/user.services';
import { InformacionEvaluacion, Resultado } from 'src/app/models/evaluacion_cumplido_prov_mid/informacion-evaluacion.model';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
import { InformacionGeneralEvaluacion } from 'src/app/models/informacion_general_evaluacion.model';
import { Item } from 'src/app/models/evaluacion_cumplido_prov_crud/item.model';
import { EvaluacionCumplidoProvCrudService } from 'src/app/services/evaluacion_cumplido_prov_crud';
import { AsignacionEvaluador } from 'src/app/models/evaluacion_cumplido_prov_crud/asignacion_evaluador.model';
import { CambioEstadoEvaluacion } from 'src/app/models/evaluacion_cumplido_prov_crud/cambio_estado_evaluacion.model';
import { EstadoEvaluacion } from 'src/app/models/evaluacion_cumplido_prov_crud/estado_evaluacion.model';
import * as ExcelJS from 'exceljs';
import { ExcelEvaluacion } from 'src/app/models/evaluacion_cumplido_prov_mid/excel_evaluacion.model';
import { saveAs } from 'file-saver';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { vfs } from './../../../../assets/vfs_fonts';
import { Router } from '@angular/router';

(pdfMake as any).addVirtualFileSystem(vfs);
(pdfMake as any).vfs = vfs;
(pdfMake as any).fonts = {
  'Raleway-SemiBold': {
    normal: 'Raleway-SemiBold',
    bold: 'Raleway-SemiBold',
    italics: 'Raleway-SemiBold',
    light: 'Raleway-SemiBold',
  },
};


@Component({
  selector: 'app-visualizar-evaluacion-contrato',
  templateUrl: './visualizar-evaluacion-contrato.component.html',
  styleUrls: ['./visualizar-evaluacion-contrato.component.scss']
})
export class VisualizarEvaluacionContratoComponent {

  tittle!: string;
  readonly panelOpenState = signal(false);
  evaluacionId!: number;
  listaItems!: string[];
  listaObservaciones: string[] = [];
  listaEvaluadores: Evaluador[] = [];
  resultadoEvaluacion: Resultado = {} as Resultado;
  listaItemsEvaluar: Item[] = [];
  asignacionEvaluadorId: number = 0;
  informacionEvaluacion!:InformacionEvaluacion;
  informacionGeneralEvaluacion!: InformacionGeneralEvaluacion;
  estadoEvaluacion: EstadoEvaluacion = {} as EstadoEvaluacion;
  loading: boolean = true;
  dataSource: any[] = [];

  constructor(
    private evaluacionCumplidoProvMidService: EvaluacionCumplidoProvMidService,
    private popUpManager: PopUpManager,
    private translate: TranslateService,
    private evaluacionCumplidoProvCrudService: EvaluacionCumplidoProvCrudService,
    private router: Router
  ){
    evaluacionCumplidoProvCrudService.asignacionEvaluador$.subscribe((asignacionEvaluador) => {
      if (asignacionEvaluador) {
        this.asignacionEvaluadorId = asignacionEvaluador.Id;
        this.evaluacionId = asignacionEvaluador.EvaluacionId.Id;
      }
    })

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {});
  }


  async ngOnInit(){
    this.tittle = 'Ver Evaluación';
    await this.obtenerInformacionEvaluacion()
  }

  displayedColumns: any[] = [
    {def: 'Identificador', header: 'ID' },
    {def: 'Nombre', header: 'NOMBRE'},
    {def: 'FichaTecnica', header: 'DESCRIPCION' },
    {def: 'Cantidad', header: 'CANTIDAD' },
    {def: 'Unidad', header: 'UNIDAD'},
    {def: 'ValorUnitario', header: 'VALOR UNITARIO' },
    {def: 'Iva', header: 'IVA' }
  ];

  async obtenerInformacionEvaluacion(){
    await this.evaluacionCumplidoProvMidService
      .get('/informacion-evaluacion/' + this.asignacionEvaluadorId)
      .pipe(
        map((response: any) => response.Data as InformacionEvaluacion)
      )
      .subscribe({
        next: (data: InformacionEvaluacion) => {
          this.informacionEvaluacion = data;
          this.informacionGeneralEvaluacion = {
            puntajeTotalEvaluacion: this.informacionEvaluacion.PuntajeTotalEvaluacion,
            clasificacion: this.informacionEvaluacion.Clasificacion,
            dependenciaEvaluadora: this.informacionEvaluacion.DependenciaEvaluadora,
            fechaEvaluacion: new Date(this.informacionEvaluacion.FechaEvaluacion),
            nombreEvaluador: this.informacionEvaluacion.NombreEvaluador,
            cargo: this.informacionEvaluacion.Cargo,
            proveedor: this.informacionEvaluacion.EmpresaProveedor,
            objetoContrato: this.informacionEvaluacion.ObjetoContrato
          };

          this.listaItemsEvaluar = this.informacionEvaluacion.ItemsEvaluados;
          this.ObtenerEstadoEvaluacion();
          this.listaEvaluadores = this.informacionEvaluacion.Evaluadores.map((evaluador) => {
            return {
              numeroCedula: evaluador.Documento,
              cargo: evaluador.Cargo,
              itemsEvaluados: evaluador.ItemEvaluado,
              evaluacionDada: evaluador.PuntajeEvaluacion,
              porcentajeEvaluacion: evaluador.PorcentajeEvaluacion
            };
          });

          for (const evaluador of this.informacionEvaluacion.Evaluadores) {
            if (evaluador.Observaciones !== "") {
              this.listaObservaciones.push(evaluador.Observaciones);
          }

          this.resultadoEvaluacion = this.informacionEvaluacion.ResultadoEvaluacion;


          this.loading = false;

        }
      },
        error: (error: any) => {
          this.popUpManager.showErrorAlert(
            this.translate.instant(
              'Error al intentar cargar la información del evaluador'
            )
          );
        }
      })
  }

  async ObtenerEstadoEvaluacion(){
    await this.evaluacionCumplidoProvCrudService
    .get(`/asignacion_evaluador/${this.asignacionEvaluadorId}`)
    .pipe(
      map((response: any) => response.Data as AsignacionEvaluador)
    )
    .subscribe({
      next: (data: AsignacionEvaluador) => {
        console.log("Asignacion Evaluacion", data)
        this.evaluacionCumplidoProvCrudService
        .get(`/cambio_estado_evaluacion/?query=EvaluacionId.Id:${data.EvaluacionId.Id},Activo:true&sortby=FechaCreacion&order=desc&limit:1`)
        .pipe(
          map((response: any) => response.Data[0] as CambioEstadoEvaluacion)
        )
        .subscribe({
          next: (estado_evaluacion: CambioEstadoEvaluacion) => {
            this.estadoEvaluacion = estado_evaluacion.EstadoEvaluacionId;
          },
          error: (error: any) => {
            this.popUpManager.showErrorAlert(
              this.translate.instant(
                'Error al intentar cargar la información del estado de la evaluación'
              )
            );
          }
        })
      },
      error: (error: any) => {
        this.popUpManager.showErrorAlert(
          this.translate.instant(
            'Error al intentar cargar la información del evaluador'
          )
        );
      }
    })
  }

  DescargarPdfEvaluacion(){
    this.evaluacionCumplidoProvMidService
    .get(`/resultado-final-evaluacion/${this.evaluacionId}`)
    .pipe(
      map((response: any) => response.Data as ExcelEvaluacion)
    )
    .subscribe({
      next: (data: ExcelEvaluacion) => {
        this.convertBase64ExcelToPDFWithStyles(data.File, 'resultado_final_evaluacion.pdf');
      },
      error:(error:any) => {
        this.popUpManager.showErrorAlert(
          this.translate.instant(
            'Error al intentar descargar el archivo'
          )
        );
      }
    })
  }



  // Función para convertir base64 a ArrayBuffer
  base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // Función para mapear alineación de Excel a PDFKit
  mapAlignment(excelAlignment: string | undefined): 'left' | 'center' | 'right' | 'justify' | undefined {
    switch (excelAlignment) {
      case 'left':
      case 'center':
      case 'right':
      case 'justify':
        return excelAlignment;
      default:
        return 'left'; // Valor predeterminado
    }
  }

  // Función principal para convertir un Excel en base64 a PDF, respetando estilos básicos
  async convertBase64ExcelToPDFWithStyles(base64Excel: string, pdfFileName: string = 'output.pdf') {
    try {
      // 1. Decodificar el archivo Excel desde base64
      const arrayBuffer = this.base64ToArrayBuffer(base64Excel);

      // 2. Cargar el archivo Excel con ExcelJS
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);

      // 3. Seleccionar la primera hoja
      const worksheet = workbook.worksheets[0];

      // 4. Crear el documento PDF con pdfmake
      const docDefinition: any = {
        content: [
          { text: 'Texto en Raleway-SemiBold', style: 'header' },
        ],
        styles: {
          header: {
            font: 'Raleway-SemiBold',
            fontSize: 18,
            bold: true,
          },
        },
        defaultStyle: {
          font: 'Raleway-SemiBold',
        },
      };

      // 5. Iterar sobre filas y celdas para agregar contenido al PDF
      worksheet.eachRow((row, rowNumber) => {
        const rowData: any[] = [];

        row.eachCell((cell, colNumber) => {
          const cellValue = cell.value ? cell.value.toString() : '';
          const fill = cell.fill as any;
          const alignment = cell.alignment;
          const font = cell.font;

          // Estilos de fondo
          const backgroundColor = fill && fill.fgColor && fill.fgColor.argb
            ? `#${fill.fgColor.argb.substring(2)}`
            : null;

          // Estilos de texto
          const textColor = font && font.color && font.color.argb
            ? `#${font.color.argb.substring(2)}`
            : 'black';

          const cellStyle = {
            fillColor: backgroundColor,
            color: textColor,
            bold: font?.bold,
            alignment: this.mapAlignment(alignment?.horizontal),
          };

          // Agregar celda a la fila del PDF
          rowData.push({ text: cellValue, style: cellStyle });
        });

        // Agregar la fila al contenido del documento
        docDefinition.content.push({
          table: {
            body: [rowData]
          },
          layout: 'Borders' // Sin bordes
        });
      });

      // 6. Generar y descargar el PDF
      pdfMake.createPdf(docDefinition).download(pdfFileName);

      console.log('PDF generado correctamente');
    } catch (error) {
      console.error('Error al procesar el archivo Excel:', error);
    }
  }


}

