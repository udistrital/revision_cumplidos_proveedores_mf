import { style } from '@angular/animations';
import { Injectable } from '@angular/core';
import { PdfMakeWrapper, Table } from 'pdfmake-wrapper';
import {
  EvaluadorDocumento,
  InformacionDocumentoEvaluacion,
  ResultadoDocumentoEvaluacion,
} from 'src/app/models/evaluacion_cumplido_prov_mid/informacion_documento_evaluacion';
import pdfFontTime from 'src/assets/fonts/vfs_fonts_times.js';
import { LOGOS } from 'src/assets/img/logos';
import { Evaluador } from './../../../../models/evaluador';
import { Subject } from 'rxjs';
import { List } from 'pdfmake-wrapper/lib/definitions/list/list';
import { Resultado } from './../../../../models/evaluacion_cumplido_prov_mid/informacion-evaluacion.model';

@Injectable({
  providedIn: 'root',
})
export class GenerarPdfEvaluacion {
  resuldoNumerico: number = 0;

  public generatePdf(infoDocEvaluacion: InformacionDocumentoEvaluacion): void {
    PdfMakeWrapper.setFonts(pdfFontTime, {
      TimesNewRoman: {
        normal: 'Times-Regular.ttf',
        bold: 'Times-Bold.ttf',
        italics: 'Times-Italic.ttf',
        bolditalics: 'Times-BoldItalic.ttf',
      },
    });

    PdfMakeWrapper.useFont('TimesNewRoman');

    const pdf = new PdfMakeWrapper();
    pdf.pageOrientation('landscape');
    pdf.styles(this.obtenerEstilos());
    pdf.add(this.obtenerHeader());
    pdf.add(this.dependenciaEvaluadora(infoDocEvaluacion));
    pdf.add(this.obtenerEmpresa(infoDocEvaluacion));
    pdf.add(this.obtenerObjetoDelContrato(infoDocEvaluacion));
    infoDocEvaluacion.ResultadoFinalEvaluacion.Evaluadores.forEach(
      (evaluador) => {
        pdf.add(this.obtenerItemsEvaluados(evaluador));
        pdf.add(this.obtenerNombreDelEncargadoDeLaEvaluacion(evaluador));
      }
    );

    pdf.add(this.criterio());
    pdf.add(
      this.cumplimiento(infoDocEvaluacion.ResultadoFinalEvaluacion.Resultados)
    );
    pdf.add(
      this.calidad(infoDocEvaluacion.ResultadoFinalEvaluacion.Resultados)
    );
    pdf.add(
      this.posContraActual(
        infoDocEvaluacion.ResultadoFinalEvaluacion.Resultados
      )
    );
    pdf.add(
      this.gestion(infoDocEvaluacion.ResultadoFinalEvaluacion.Resultados)
    );
    pdf.add(this.convencion());
    pdf.create().open();
  }

  obtenerHeader(): any {
    return {
      layout: 'default',
      margin: [0, 0, 0, 0], pageBreak: 'auto',

      table: {
        widths: ['10%', '45%', '30%', '15%'],
        body: [
          [
            {
              image: LOGOS.escudo,
              width: 50,
              alignment: 'center',
              rowSpan: 3,
            },
            {
              text: 'EVALUACIÓN Y REEVALUACIÓN DE PROVEEDORES',
              style: 'TitleHeader',
              border: [true, true, true, true],
              alignment: 'center',
              height: 50,
            },
            {
              text: 'Código: GC-PR-006-FR-028',
              style: 'TextHeader',
              border: [true, true, true, true],
              alignment: 'center',
              height: 70,
              fontSize: 10,
              lineHeight: 1.2,
            },
            {
              image: LOGOS.sigud,
              alignment: 'center',
              rowSpan: 3,
              margin: [0, 15, 0, 0],
              fit: [90, 80],
            },
          ],
          [
            '',
            {
              text: 'Macroproceso: Gestión de Recursos',
              style: 'TextHeader',
              border: [true, true, true, true],
              alignment: 'center',
              height: 50,
              fontSize: 10,
              lineHeight: 1.2,
            },
            {
              text: 'Versión: 03',
              style: 'TextHeader',
              border: [true, true, true, true],
              alignment: 'center',
              height: 50,
              lineHeight: 1.2,
            },
            '',
          ],
          [
            '',
            {
              text: 'Proceso: Gestión Contractual',
              style: 'TextHeader',
              border: [true, true, true, true],
              alignment: 'center',
              height: 50,
              lineHeight: 1.2,
            },
            {
              text: 'Fecha de Aprobación: 04/06/2019',
              style: 'TextHeader',
              border: [true, true, true, true],
              alignment: 'center',
              height: 50,
              lineHeight: 1.2,
            },
            '',
          ],
        ],
      }, 
    };
  }

  dependenciaEvaluadora(
    infoDocEvaluacion: InformacionDocumentoEvaluacion
  ): any {
    return {
      layout: 'default',
      margin: [0, 5, 0, 0], pageBreak: 'auto',
      table: {
        widths: ['22.6%', '53%', '9.4%', '15%'],
        body: [
          [
            {
              text: 'DEPENDENCIA QUE EVALUA:',
              style: 'TablaInfo',
              border: [true, true, true, true],
            },
            {
              text: infoDocEvaluacion.Dependencia,
              style: 'TextoNormal',
              border: [true, true, true, true],
            },
            {
              text: 'FECHA:',
              style: 'TablaInfo',
              border: [true, true, true, true],
            },
            {
              text: '',
              style: '',
              border: [true, true, true, true],
            },
          ],
        ],
      },
    };
  }

  obtenerEmpresa(infoDocEvaluacion: InformacionDocumentoEvaluacion): any {
    return {
      layout: 'default',
      margin: [0, 0, 0, 0], pageBreak: 'auto',
      table: {
        widths: ['22%', '78%'],
        body: [
          [
            {
              text: 'EMPRESA o PROVEEDOR:',
              style: 'TablaInfo',
              border: [true, false, true, true],
            },
            {
              text: infoDocEvaluacion.EmpresaProveedor,
              style: 'TextoNormal',
              border: [true, false, true, true],
            },
          ],
        ],
      },
    };
  }

  obtenerObjetoDelContrato(
    infoDocEvaluacion: InformacionDocumentoEvaluacion
  ): any {
    return {
      layout: 'default',
      margin: [0, 0, 0, 0], pageBreak: 'auto',
      table: {
        widths: ['22%', '78%'],
        body: [
          [
            {
              text: 'OBJETO DEL CONTRATO:',
              style: 'TablaInfo',
              border: [true, false, true, true],
            },
            {
              text: infoDocEvaluacion.ObjetoContrato,
              style: 'TextoNormal',
              border: [true, false, true, true],
            },
          ],
        ],
      },
    };
  }

  obtenerItemsEvaluados(evaluador: EvaluadorDocumento): any {
    return {
      layout: 'default',
      margin: [0, 5, 0, 0],
      table: {
        dontBreakRows: true,
        widths: ['22%', '78%'],
        body: [
          [
            {
              text: 'ITEM EVALUADO (*):',
              style: 'TablaInfo',
              border: [true, true, true, true],
            },
            {
              text: evaluador.Items,
              style: 'TextoNormal',
              border: [true, true, true, true],
            },
          ],
        ],
      },
    
    };
  }

  obtenerNombreDelEncargadoDeLaEvaluacion(evaluador: EvaluadorDocumento): any {
    return {
      layout: 'default',
      margin: [0, 0, 0, 5], pageBreak: 'auto',
      table: {
        widths: ['22.55%', '52%', '11%', '14.45%'],
        body: [
          [
            {
              text: 'NOMBRE DEL SUPERVISOR ENCARGADO DE LA EVALUACIÓN:',
              bold: true,
              alignment: 'left',
              style: 'TablaInfo',
              border: [true, false, true, true],
            },
            {
              text: evaluador.Nombre,
              style: 'TextoNormal',
              margin: [0, 5, 0, 0],
              alignment: 'left',
              border: [true, false, true, true],
            },
            {
              text: 'CARGO',
              alignment: 'center',
              style: 'TextInfo',
              border: [true, false, true, true],
              margin: [0, 5, 0, 0],
            },
            {
              text: evaluador.Cargo,
              alignment: 'left',
              style: 'TextoNormal',
              border: [true, false, true, true],
            },
          ],
        ],
      },
    };
  }

  criterio(): any {
    return {
      layout: 'default', pageBreak: 'auto',
      margin: [0, 3, 0, 0],
      table: {
        widths: ['11%', '11%', '41%', '11%', '11%', '15%'],
        body: [
          [
            {
              text: 'CRITERIO:',
              bold: true,
              alignment: 'center',
              style: 'TituloCriterio',
              margin: [0, 5, 0, 0],
              border: [true, true, true, true],
            },
            {
              text: 'SUBCRITERIO',
              style: 'TituloSubCriterio',
              margin: [0, 5, 0, 0],
              alignment: 'center',
              border: [true, true, true, true],
            },
            {
              text: 'ITEM',
              alignment: 'center',
              style: 'TextInfo',
              border: [true, true, true, true],
              margin: [0, 5, 0, 0],
            },
            {
              text: 'SELECCIONE RESPUESTA',
              alignment: 'center',
              style: 'TextInfo',
              margin: [0, 1.5, 0, 0],
              border: [true, true, true, true],
            },
            {
              text: 'VALOR ASIGNADO',
              alignment: 'center',
              style: 'TextInfo',
              margin: [0, 1.5, 0, 0],
              border: [true, true, true, true],
            },
            {
              text: 'PUNTAJE TOTAL',
              margin: [0, 1.5, 0, 0],
              alignment: 'center',
              style: 'TextInfo',
              border: [true, true, true, true],
            },
          ],
        ],
      },
    
    };
  }

  cumplimiento(resultado: ResultadoDocumentoEvaluacion[]): any {
    let pregunta1 =
      '¿Se cumplieron los tiempos de entrega de bienes o la prestación del servicios ofertados por el proveedor?';
    let pregunta2 = '¿Se entregan las cantidades solicitadas?';

    let CANTIDADES = this.obtenerResultadoPorTitulo(pregunta2, resultado);
    let TIEMPOS_DE_ENTREGA = this.obtenerResultadoPorTitulo(
      pregunta1,
      resultado
    );
    let listaCumplimiento = [CANTIDADES, TIEMPOS_DE_ENTREGA];

    let sumaPuntaje = this.sumarValoresSiCumple(listaCumplimiento);
    this.calcularTotalNumerico(sumaPuntaje);

    return {
      layout: 'default', pageBreak: 'auto',
      margin: [0, 0, 0, 0],
      table: {
        widths: ['11%', '11%', '41%', '11%', '11%', '15%'],
        body: [
          [
            {
              text: 'CUMPLIMIENTO  \n (24 puntos)',
              bold: true,
              alignment: 'center',
              style: 'TituloCriterio',
              border: [true, false, true, true],
              rowSpan: 2,
              margin: [0, 5, 0, 0],
              fillColor: '#EEECE1',
            },
            {
              text: 'TIEMPOS DE ENTREGA',
              style: 'TituloSubCriterio',
              fillColor: '#EEECE1',
              border: [true, false, true, true],
            },
            {
              text: pregunta1,
              alignment: 'center',
              fillColor: '#EEECE1',
              fontSize: 8,
              border: [true, false, true, true],
            },
            {
              text: TIEMPOS_DE_ENTREGA.Cumplimiento,
              alignment: 'center',
              style: 'TextInfo',
              fillColor: '#EEECE1',
              border: [true, false, true, true],
            },
            {
              text: TIEMPOS_DE_ENTREGA.ValorAsignado,
              alignment: 'center',
              style: 'TextInfo',
              fillColor: '#EEECE1',
              border: [true, false, true, true],
            },
            {
              text: sumaPuntaje,
              alignment: 'center',
              style: 'TextInfo',
              fillColor: '#EEECE1',
              margin: [0, 10, 0, 0],
              border: [true, false, true, true],
              rowSpan: 2,
            },
          ],
          [
            '',
            {
              text: 'CANTIDADES',
              style: 'TituloSubCriterio',
              fillColor: '#EEECE1',
              border: [true, false, true, true],
            },
            {
              text: pregunta2,
              alignment: 'center',
              fontSize: 8,
              fillColor: '#EEECE1',
              border: [true, false, true, true],
            },
            {
              text: CANTIDADES.Cumplimiento,
              alignment: 'center',
              style: 'TextInfo',
              fillColor: '#EEECE1',
              border: [true, false, true, true],
            },
            {
              text: CANTIDADES.ValorAsignado,
              alignment: 'center',
              fillColor: '#EEECE1',
              style: 'TextInfo',
              border: [true, false, true, true],
            },
            '',
          ],
        ],
      },
    };
  }

  calidad(resultado: ResultadoDocumentoEvaluacion[]): any {
    let pregunta1 =
      '¿El bien o servicio cumplió con las especificaciones y requisitos pactados en el momento de entrega?';
    let pregunta2 =
      '¿El producto comprado o el servicio prestado proporcionó más herramientas o funciones de las solicitadas originalmente?';
    let CONFORMIDAD = this.obtenerResultadoPorTitulo(pregunta1, resultado);
    let FUNCIONALIDAD_ADICCIONAL = this.obtenerResultadoPorTitulo(
      pregunta2,
      resultado
    );
    let listaCalidad = [CONFORMIDAD, FUNCIONALIDAD_ADICCIONAL];
    let sumaPuntaje = this.sumarValoresSiCumple(listaCalidad);
    this.calcularTotalNumerico(sumaPuntaje);
    return {
      layout: 'default', pageBreak: 'auto',
      table: {
        widths: ['11%', '11%', '41%', '11%', '11%', '15%'],
        body: [
          [
            {
              text: 'Calidad \n (30 puntos)',
              bold: true,
              alignment: 'center',
              style: 'TituloCriterio',
              border: [true, false, true, true],
              rowSpan: 2,
              margin: [0, 8, 0, 0],
              fillColor: '#EBF1DE',
            },
            {
              text: 'CONFORMIDAD',
              style: 'TituloSubCriterio',
              fillColor: '#EBF1DE',
              border: [true, false, true, true],
            },
            {
              text: pregunta1,
              alignment: 'center',
              fillColor: '#EBF1DE',
              fontSize: 8,
              border: [true, false, true, true],
            },
            {
              text: CONFORMIDAD.Cumplimiento,
              alignment: 'center',
              style: 'TextInfo',
              fillColor: '#EBF1DE',
              border: [true, false, true, true],
            },
            {
              text: CONFORMIDAD.ValorAsignado,
              alignment: 'center',
              style: 'TextInfo',
              fillColor: '#EBF1DE',
              margin: [0, 5, 0, 0],
              border: [true, false, true, true],
            },
            {
              text: sumaPuntaje,
              alignment: 'center',
              style: 'TextInfo',
              fillColor: '#EBF1DE',
              border: [true, false, true, true],
              rowSpan: 2,
              margin: [0, 15, 0, 0],
            },
          ],
          [
            '',
            {
              text: 'FUNCIONALIDAD ADICIONAL',
              style: 'TituloSubCriterio',
              fillColor: '#EBF1DE',
              border: [true, true, true, true],
            },
            {
              text: pregunta2,
              alignment: 'center',
              fontSize: 8,
              fillColor: '#EBF1DE',
              border: [true, true, true, true],
            },
            {
              text: FUNCIONALIDAD_ADICCIONAL.Cumplimiento,
              alignment: 'center',
              style: 'TextInfo',
              fillColor: '#EBF1DE',
              border: [true, true, true, true],
            },
            {
              text: FUNCIONALIDAD_ADICCIONAL.ValorAsignado,
              alignment: 'center',
              fillColor: '#EBF1DE',
              style: 'TextInfo',
              margin: [0, 5, 0, 0],
              border: [true, true, true, true],
            },
            '',
          ],
        ],
      },
    };
  }

  posContraActual(resultado: ResultadoDocumentoEvaluacion[]): any {
    let pregunta1 =
      '¿Se han presentado reclamaciones al proveedor en calidad o gestión?';
    let pregunta2 =
      '¿El proveedor soluciona oportunamente las no conformidades de calidad y gestión de los bienes o servicios recibidos?';
    let pregunta3 =
      '¿El proveedor cumple con los compromisos pactados dentro del contrato u orden de servicio o compra? (aplicación de garantías, mantenimiento, cambios, reparaciones, capacitaciones, entre otras)';

    let RECLAMACIONES = this.obtenerResultadoPorTitulo(pregunta1, resultado);
    let RECLAMACIONES2 = this.obtenerResultadoPorTitulo(pregunta2, resultado);
    let SERVICIO_POS_VENTA = this.obtenerResultadoPorTitulo(
      pregunta3,
      resultado
    );
    let listaReclamaciones = [RECLAMACIONES, RECLAMACIONES2];
    let sumaPuntaje = this.sumarValoresSiCumple(listaReclamaciones);
    this.calcularTotalNumerico(sumaPuntaje);
    this.calcularTotalNumerico(Number(SERVICIO_POS_VENTA.ValorAsignado));
    return {
      layout: 'default',
      margin: [0, 0, 0, 0], pageBreak: 'auto',
      table: {
        widths: ['11%', '11%', '41%', '11%', '11%', '15%'],
        body: [
          [
            {
              text: 'POS CONTRACTUAL\n(22 puntos)',
              style: 'TituloCriterio',
              alignment: 'center',
              fontSize: 8,
              border: [true, false, true, true],
              rowSpan: 3,
              margin: [0, 15, 0, 0],
              fillColor: '#DCE6F1',
            },
            {
              text: 'RECLAMACIONES',
              style: 'TituloSubCriterio',
              fillColor: '#DCE6F1',
              rowSpan: 2,
              margin: [0, 15, 0, 0],
              border: [true, false, true, true],
            },
            {
              text: pregunta1,
              alignment: 'center',
              fillColor: '#DCE6F1',
              fontSize: 8,
              border: [true, false, true, true],
            },
            {
              text: RECLAMACIONES.Cumplimiento,
              alignment: 'center',
              style: 'TextInfo',
              fillColor: '#DCE6F1',
              border: [true, false, true, true],
            },
            {
              text: RECLAMACIONES.ValorAsignado,
              alignment: 'center',
              style: 'TextInfo',
              margin: [0, 5, 0, 0],
              fillColor: '#DCE6F1',
              border: [true, false, true, true],
            },
            {
              text: sumaPuntaje,
              alignment: 'center',
              style: 'TextInfo',
              fillColor: '#DCE6F1',
              border: [true, false, true, true],
              margin: [0, 20, 0, 0],
              rowSpan: 3,
            },
          ],
          [
            '',
            '',
            {
              text: ' (●)' + pregunta2,
              alignment: 'center',
              fontSize: 8,
              fillColor: '#DCE6F1',
              border: [true, true, true, true],
            },
            {
              text: RECLAMACIONES2.Cumplimiento,
              alignment: 'center',
              style: 'TextInfo',
              fillColor: '#DCE6F1',
              border: [true, true, true, true],
            },
            {
              text: RECLAMACIONES2.ValorAsignado,
              alignment: 'center',
              fillColor: '#DCE6F1',
              style: 'TextInfo',
              margin: [0, 5, 0, 0],
              border: [true, true, true, true],
            },
            '',
          ],
          [
            '',
            {
              text: 'SERVICIO POS VENTA',
              style: 'TituloSubCriterio',
              fillColor: '#DCE6F1',
              border: [true, true, true, true],
            },
            {
              text: pregunta3,
              alignment: 'center',
              fontSize: 8,
              fillColor: '#DCE6F1',
              border: [true, true, true, true],
            },
            {
              text: SERVICIO_POS_VENTA.Cumplimiento,
              alignment: 'center',
              style: 'TextInfo',
              fillColor: '#DCE6F1',
              border: [true, true, true, true],
            },
            {
              text: SERVICIO_POS_VENTA.ValorAsignado,
              alignment: 'center',
              fillColor: '#DCE6F1',
              style: 'TextInfo',
              margin: [0, 10, 0, 0],
              border: [true, true, true, true],
            },
            '',
          ],
        ],
      },
    };
  }

  gestion(resultado: ResultadoDocumentoEvaluacion[]): any {
    let pregunta1 =
      '¿El contrato es suscrito en el tiempo pactado, entrega las pólizas a tiempo y las facturas son radicadas en el tiempo indicado con las condiciones y soportes requeridos para su trámite contractual?';
    let pregunta2 =
      '¿Se requirió hacer uso de la garantía del producto o servicio?';
    let pregunta3 =
      '¿El proveedor cumplió a satisfacción con la garantía pactada?';

    let PROCEDIMIENTOS = this.obtenerResultadoPorTitulo(pregunta1, resultado);
    let GARANTÍA = this.obtenerResultadoPorTitulo(pregunta2, resultado);
    let GARANTÍA2 = this.obtenerResultadoPorTitulo(pregunta3, resultado);
    let listaGrantia = [GARANTÍA, GARANTÍA2];
    let sumaPuntaje = this.sumarValoresSiCumple(listaGrantia);
    this.calcularTotalNumerico(sumaPuntaje);
    this.calcularTotalNumerico(Number(PROCEDIMIENTOS.ValorAsignado));
    return {
      layout: 'default',
      margin: [0, 0, 0, 0],
      pageBreak: 'auto',
      keepWithHeaderRows: 1,
      table: {
        widths: ['11%', '11%', '41%', '11%', '11%', '15%'],
        body: [
          [
            {
              text: 'GESTIÓN\n(24 puntos)',
              style: 'TituloCriterio',
              alignment: 'center',
              border: [true, false, true, true],
              rowSpan: 4,
              margin: [0, 15, 0, 0],
              fillColor: '#E4DFEC',
            },
            {
              text: 'PROCEDIMIENTOS',
              style: 'TituloSubCriterio',
              alignment: 'center',
              fillColor: '#E4DFEC',
              rowSpan: 2,
              border: [true, false, true, true],
            },
            {
              text: pregunta1,
              alignment: 'center',
              fillColor: '#E4DFEC',
              fontSize: 8,
              rowSpan: 2,
              border: [true, false, true, true],
            },
            {
              text: PROCEDIMIENTOS.Cumplimiento,
              alignment: 'center',
              style: 'TextInfo',
              fillColor: '#E4DFEC',
              rowSpan: 2,
              margin: [0, 10, 0, 0],
              border: [true, false, true, true],
            },
            {
              text: PROCEDIMIENTOS.ValorAsignado,
              alignment: 'center',
              style: 'TextInfo',
              rowSpan: 2,
              margin: [0, 10, 0, 0],
              fillColor: '#E4DFEC',
              border: [true, false, true, true],
            },
            {
              text: PROCEDIMIENTOS.ValorAsignado,
              alignment: 'center',
              style: 'TextInfo',
              fillColor: '#E4DFEC',
              margin: [0, 8, 0, 0],
              border: [true, false, true, true],
              rowSpan: 2,
            },
          ],
          ['', '', '', '', '', ''],
          [
            '',
            {
              text: 'GARANTÍA',
              style: 'TituloSubCriterio',
              fillColor: '#E4DFEC',
              rowSpan: 2,
              border: [true, true, true, true],
            },
            {
              text: pregunta2,
              alignment: 'center',
              fontSize: 8,
              fillColor: '#E4DFEC',
              border: [true, true, true, true],
            },
            {
              text: GARANTÍA.Cumplimiento,
              alignment: 'center',
              style: 'TextInfo',
              fillColor: '#E4DFEC',
              border: [true, true, true, true],
            },
            {
              text: GARANTÍA.ValorAsignado,
              alignment: 'center',
              fillColor: '#E4DFEC',
              style: 'TextInfo',
              border: [true, true, true, true],
            },
            {
              text: sumaPuntaje,
              alignment: 'center',
              fillColor: '#E4DFEC',
              style: 'TextInfo',
              rowSpan: 2,
              margin: [0, 5, 0, 0],
              border: [true, true, true, true],
            },
          ],
          [
            '',
            '',
            {
              text: '(●)' + pregunta3,
              alignment: 'center',
              fontSize: 8,
              fillColor: '#E4DFEC',
              border: [true, true, true, true],
            },
            {
              text: GARANTÍA2.Cumplimiento,
              alignment: 'center',
              style: 'TextInfo',
              fillColor: '#E4DFEC',
              border: [true, true, true, true],
            },
            {
              text: GARANTÍA2.ValorAsignado,
              alignment: 'center',
              fillColor: '#E4DFEC',
              style: 'TextInfo',
              border: [true, true, true, true],
            },
            '',
          ],
        ],
      },
    };
  }

  convencion(): any {
    return {
      layout: 'default',
      keepWithHeaderRows: 1,
      table: {
       
        widths: ['10.72%', '10.70%', '63.95%', '14.63%'],
        body: [
          [
            {
              text: 'CONVENCIÓN',
              bold: true,
              alignment: 'center',
              fontSize: 8,
              border: [true, true, true, true],
              margin: [0, 30, 0, 0],
              rowSpan: 4,
            },
            {
              text: 'SÍMBOLO - SIGNIFICADO',
              fontSize: 8,
              bold: true,
              alignment: 'center',

              rowSpan: 1,
              border: [true, true, true, true],
            },
            {
              text: [
                {
                  text: 'PROVEEDOR TIPO A: EXCELENTE. ',
                  style: 'TextoNegrilla',
                  decoration: 'underline',
                },
                {
                  text: 'Puntaje mayor o igual a 80 hasta 100 puntos.',
                  style: 'TextoNegrilla',
                },
                {
                  text: ' Se puede contratar nuevamente\n',
                  style: 'TextoNormal',
                  fontSize: 9,
                },
                {
                  text: 'PROVEEDOR TIPO B: BUENO. ',
                  style: 'TextoNegrilla',
                  decoration: 'underline',
                },
                {
                  text: 'Puntaje entre 46 hasta 79 puntos.',
                  style: 'TextoNegrilla',
                  fontSize: 9,
                },
                {
                  text: 'Se invita nuevamente a procesos pero debe mejorar las observaciones presentadas por la Universidad. La Universidad (Supervisor) presentará las observaciones mediante oficio adjunto al presente formato.\n',
                  style: 'TextoNormal',
                  fontSize: 9,
                },
                {
                  text: 'PROVEEDOR TIPO C: MALO.',
                  style: 'TextoNegrilla',
                  decoration: 'underline',
                },
                {
                  text: 'Puntaje inferior o igual a 45 puntos.',
                  style: 'TextoNegrilla',
                },
                {
                  text: ' La Universidad no debe contratar con este proveedor.',
                  style: 'TextoNormal',
                },
              ],
              margin: [0, 10, 0, 0],
              alignment: 'left',
              rowSpan: 4,
              border: [true, true, true, true],
            },
            {
              margin: [0, 5, 0, 0],
              text: this.resuldoNumerico,
              alignment: 'center',
              style: 'TextInfo',
              rowSpan: 1,
              border: [true, true, true, true],
            },
          ],
          [
            '',
            {
              text: '(●) Se responde si la anterior pregunta tiene una ponderación de cero o SI',
              alignment: 'center',
              style: 'TextoNormal',
              rowSpan: 3,

              border: [true, true, true, true],
            },
            '',
            {
              text: this.calcularTotalTexto(this.resuldoNumerico),
              alignment: 'center',
              margin: [0, 20, 0, 0],
              style: 'TextInfo',
              rowSpan: 3,
              border: [true, true, true, true],
            },
          ],
          ['', '', '', ''],
          ['', '', '', ''],
        ],
      },
    };
  }

  obtenerEstilos(): any {
    return {
      TitleHeader: {
        bold: true,
        fontSize: 9,
        alignment: 'center',
      },
      TextHeader: {
        fontSize: 9,
        alignment: 'left',
      },
      TextInfo: {
        bold: true,
        fontSize: 8,
      },
      TituloCriterio: {
        bold: true,
        fontSize: 8,
        alignment: 'center',
      },
      TituloSubCriterio: {
        fontSize: 7,
        bold: true,
        alignment: 'center',
      },
      TablaInfo: {
        fontSize: 7,
        bold: true,
        alignment: 'justify',
      },
      TextoNormal: {
        fontSize: 9,
      },
      TextoNegrilla: {
        fontSize: 8,
        bold: true,
      },
    };
  }

  obtenerResultadoPorTitulo(
    tituloBuscar: string,
    listaResultados: ResultadoDocumentoEvaluacion[]
  ): ResultadoDocumentoEvaluacion {
    const resultado = listaResultados.find(
      (item) =>
        item.Pregunta?.toLocaleLowerCase() === tituloBuscar.toLocaleLowerCase()
    );

    if (resultado) {
      return {
        ValorAsignado: resultado.ValorAsignado,
        Cumplimiento: resultado.Cumplimiento,
      };
    }
    return {
      ValorAsignado: 0,
      Cumplimiento: '',
    };
  }

  sumarValoresSiCumple(
    listaResultados: ResultadoDocumentoEvaluacion[]
  ): number {
    return listaResultados.reduce((acumulador, item) => {
      if (item.Cumplimiento === 'SI' && item.ValorAsignado) {
        return acumulador + item.ValorAsignado;
      }

      return acumulador;
    }, 0);
  }

  calcularTotalNumerico(total: number) {
    this.resuldoNumerico = this.resuldoNumerico + total;
  }

  calcularTotalTexto(total: number): string {;

    if (total >= 80) {
      return 'EXCELENTE';
    }

    if (total >= 46 && total <= 79) {
      return 'BUENO';
    }

    if (total <= 45) {
      return 'MALO';
    }
    return 'NO DEFINIDO';
  }


  
}

//   organizarPorCategoriaYSubcategoria(datos: InformacionDocumentoEvaluacion): Map<string, Map<string, Resultados[]> > {
//     let categoria = new Map<string, Map<string, Resultados[]>>();

//     datos.ResultadoFinalEvaluacion.Resultados.forEach((resultado) => {
//       if (!categoria.has(resultado.Categoria)) {
//         let subCategoria = new Map<string, Resultados[]>();
//         subCategoria.set(resultado.Titulo, [resultado]);
//         categoria.set(resultado.Categoria, subCategoria);
//       } else {
//         let subCategoria = categoria.get(resultado.Categoria);

//         if (!subCategoria) {
//           subCategoria = new Map<string, Resultados[]>();
//           categoria.set(resultado.Categoria, subCategoria);
//         }

//         if (!subCategoria.has(resultado.Titulo)) {
//           subCategoria.set(resultado.Titulo, [resultado]);
//         } else {
//           let resultados = subCategoria.get(resultado.Titulo);
//           if (resultados) {
//             resultados.push(resultado);
//           }
//         }
//       }
//     });
//     return categoria;
//   }
