import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  // Inputs para recibir datos
  @Input() displayedColumns: any[] = [];
  @Input() data: any[] = [];

  // Output para emitir eventos cuando se haga clic en un botón de acción
  @Output() actionClicked = new EventEmitter<{action: any, element: any}>();

  dataSource = new MatTableDataSource<any>(this.data);
  columnKeys!: string[];

  // Se inicializan los datos de la tabla, la paginacion y la ordenacion
  ngOnInit(): void {
    this.dataSource.data = this.data;
    console.log("Data:", this.data)
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Claves de las columnas para el mat-table
    this.columnKeys = this.displayedColumns.map(c => c.def);
  }

  // Método para manejar los clics en las acciones
  actionClick(action: any, element: any): void {
    this.actionClicked.emit({action, element});
  }

}
