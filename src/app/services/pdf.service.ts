import { Injectable } from '@angular/core';
import * as PDFKit from 'pdfkit';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private pdfDoc: PDFKit.PDFDocument;
  constructor() {
    this.pdfDoc = new PDFKit();
  }

}
