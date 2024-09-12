import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CumplidosReversibles } from '../../../models/cumplidos_revertibles.model'
import { MatTableDataSource } from '@angular/material/table';
import { CambioEstadoService } from '../../../services/cambio_estado_service'
import { AletManagerService } from '../../../managers/alert-manager.service'
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @Input() displayedColumns: any[] = [];
  @Input() data: CumplidosReversibles[] = [];

  dataSource = new MatTableDataSource<CumplidosReversibles>(this.data);
  columnKeys!: string[];

  constructor(
    private cambioEstadoService : CambioEstadoService,
    private alertService: AletManagerService,
    private dialog:MatDialog
  ) {

  }

  ngOnInit(): void {

    this.dataSource.data = this.data;
    // Apply paginator
    this.dataSource.paginator = this.paginator;

    // Apply sort option
    this.dataSource.sort = this.sort;

    this.columnKeys = this.displayedColumns.map(c => c.def);



  }

<<<<<<< Updated upstream
=======
  async RechazarCumplido(idcumplido: number){
    console.log(idcumplido)
    let comfirm = await this.alertService.alertConfirm("¿Esta seguro de revertir el cumplido?")
    if(comfirm.isConfirmed){
      await this.cambioEstadoService.cambiarEstado(idcumplido, 'RO')
      Swal.close()
      this.alertService.showSuccessAlert("Cumplido Revertido", "Se ha revertido el cumplido proveedor con exito")
    } else {
      this.alertService.showCancelAlert("Cancelado", "No se ha revertido el estado del cumplido")
    }

  }

>>>>>>> Stashed changes



}
