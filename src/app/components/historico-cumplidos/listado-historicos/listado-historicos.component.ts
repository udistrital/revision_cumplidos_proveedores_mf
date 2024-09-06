import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AletManagerService } from 'src/app/managers/alert-manager.service';
import { HistoricoCumplido } from 'src/app/models/historico-cumplido.model';
import Swal from 'sweetalert2';
import { CargarModalComponent } from '../../subir_soporte/cargar-modal/cargar-modal.component';
import { VisualizarSoportesComponent } from '../../subir_soporte/visualizar-soportes/visualizar-soportes.component';
import { SoporteCumplidoComponent } from '../../subir_soporte/soporte-cumplido/soporte-cumplido.component';
import { ModalHistoricoComponent } from '../modal-historico/modal-historico.component';

@Component({
  selector: 'app-listado-historicos',
  templateUrl: './listado-historicos.component.html',
  styleUrls: ['./listado-historicos.component.css'],
})
export class ListadoHistoricosComponent implements OnInit {
  @Input() displayedColumns: any[] = [];
  @Input() dataSource: HistoricoCumplido[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private alertService:AletManagerService,private dialog:MatDialog ){}
  
  dataSourcetest = new MatTableDataSource<HistoricoCumplido>();

  ngOnInit(): void {
    this.dataSourcetest.data = this.dataSource;
  }
  ngAfterViewInit() {
    this.dataSourcetest.paginator = this.paginator;
  }


  async descargarDocumentos(){
    let comfirm = await this.alertService.alertConfirm("¿Estas seguro?","Vas a descargar lo documentos, pude tomar unos momentos")

    if(comfirm.isConfirmed){
      
      await this.descargaTemp()
      Swal.close()
      this.alertService.showSuccessAlert("Completado","Se ha completado descarga")
    }else{
     this.alertService.showCancelAlert("Cancelado", "No se realizo ninguna accion")
    }
   }


   
descargaTemp():Promise<void> {
  return new Promise((resolve, reject) => {
    this.alertService.showLoadingAlert("Espera","La descarga se esta realizando")
    setTimeout(() => {
      
      resolve();
    }, 2000);
  });
}



modalDocumentosCargados() {
console.log("Entro");
  this.dialog.open(ModalHistoricoComponent, {
    disableClose: true,
    height: '70vh',
    width: '40vw',
    maxWidth: '60vw',
    maxHeight: '80vh',
    panelClass: 'custom-dialog-container',
    data: {
    },
  });
}


  }





