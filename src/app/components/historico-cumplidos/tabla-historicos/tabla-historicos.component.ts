import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AletManagerService } from 'src/app/managers/alert-manager.service';
import { HistoricoCumplido } from 'src/app/models/historico-cumplido.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tabla-historicos',
  templateUrl: './tabla-historicos.component.html',
  styleUrls: ['./tabla-historicos.component.css'],
})
export class TablaHistoricosComponent implements OnInit {
  @Input() displayedColumns: any[] = [];
  @Input() dataSource: HistoricoCumplido[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private alertService:AletManagerService ){}
  
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
  }





