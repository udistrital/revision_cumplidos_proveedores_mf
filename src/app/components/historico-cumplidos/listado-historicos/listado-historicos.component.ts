import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';

import { ModalHistoricoComponent } from '../modal-historico/modal-historico.component';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { HistoricoCumplido } from 'src/app/models/historico-cumplido.model';
import { Cumplido } from 'src/app/models/cumplido';

@Component({
  selector: 'app-listado-historicos',
  templateUrl: './listado-historicos.component.html',
  styleUrls: ['./listado-historicos.component.css'],
})
export class ListadoHistoricosComponent implements OnInit {
  @Input() displayedColumns: any[] = [];
  @Input() dataSource: Cumplido[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private popUpManager: PopUpManager, private dialog: MatDialog) {}

  dataSourcetest = new MatTableDataSource<Cumplido>();

  ngOnInit(): void {
    this.dataSourcetest.data = this.dataSource;
  }
  ngAfterViewInit() {
    this.dataSourcetest.paginator = this.paginator;
  }

  async descargarDocumentos() {
    let comfirm = await this.popUpManager.showConfirmAlert(
      '¿Estas seguro?',
      'Vas a descargar lo documentos, pude tomar unos momentos'
    );

    if (comfirm.isConfirmed) {
      await this.descargaTemp();
      Swal.close();
      this.popUpManager.showSuccessAlert('Se ha completado descarga');
    } else {
      this.popUpManager.showErrorAlert('No se realizo ninguna accion');
    }
  }

  descargaTemp(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.popUpManager.showLoadingAlert(
        'Espera',
        'La descarga se esta realizando'
      );
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  }

  modalDocumentosCargados() {
    console.log('Entro');
    this.dialog.open(ModalHistoricoComponent, {
      disableClose: true,
      height: '70vh',
      width: '100vw',
      maxWidth: '60vw',
      maxHeight: '80vh',
      panelClass: 'container-historico',
      data: {},
    });
  }


  handleActionClick(event: { action: any; element: any }) {
    if (event.action.actionName === 'visibility') {
      this.modalDocumentosCargados();
    } else if (event.action.actionName === 'archive') {
      this.descargaTemp();
    } 
  }
}
