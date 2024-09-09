import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CumplidosReversibles } from '../../../models/cumplidos_revertibles.model'
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @Input() displayedColumns: any[] = [];
  @Input() lista_cumplidos: CumplidosReversibles[] = [];

  dataSource = new MatTableDataSource<CumplidosReversibles>(this.lista_cumplidos);
  columnKeys!: string[];

  ngOnInit(): void {

    this.dataSource.data = this.lista_cumplidos;
    // Apply paginator
    this.dataSource.paginator = this.paginator;

    // Apply sort option
    this.dataSource.sort = this.sort;

    this.columnKeys = this.displayedColumns.map(c => c.def);



  }

  // Generar un array con los nombres de las columnas



}
