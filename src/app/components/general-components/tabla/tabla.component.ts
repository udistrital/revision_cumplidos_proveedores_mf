import { Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent {

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  // Inputs para recibir datos
  @Input() displayedColumns: any[] = [];
  @Input() data: any[] = [];

  // Output para emitir eventos cuando se haga clic en un botón de acción
  @Output() actionClicked = new EventEmitter<{action: any, element: any}>();

  dataSource = new MatTableDataSource<any>([]);
  columnKeys!: string[];

  // FormControl para los filtros
  filterControls: { [key: string]: FormControl } = {};
  filteredValues: { [key: string]: string } = {};

  // Se inicializan los datos de la tabla, la paginacion y la ordenacion
  ngOnInit(): void {
    // Claves de las columnas para el mat-table
    this.columnKeys = this.displayedColumns.map(c => c.def);

    // Inicializar filtros y FormControls para cada columna
    this.displayedColumns.forEach(column => {
      if (!column.isAction) {
        this.filterControls[column.def] = new FormControl('');
        this.filteredValues[column.def] = '';
        this.filterControls[column.def].valueChanges.subscribe((filterValue) => {
          this.filteredValues[column.def] = filterValue;
          this.dataSource.filter = JSON.stringify(this.filteredValues);
        });
      }
    });

    // Definir el custom filterPredicate
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Detecta si hay cambios en el input de datos
    if (changes['data']) {
      // Asigna los nuevos datos al dataSource
      this.dataSource.data = this.data;
      // Reinicia el paginador y el sort si es necesario
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Custom filterPredicate para aplicar múltiples filtros
  customFilterPredicate() {
    return (data: any, filter: string): boolean => {
      const searchString = JSON.parse(filter);
      let isMatch = true;

      for (let key in searchString) {
        const filterValue = searchString[key];
        const dataValue = data[key];

        if (filterValue) {
          if (key.toLowerCase().includes('fecha') && dataValue) {
            const formattedDate = new Date(dataValue).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            });

            if (!formattedDate.includes(filterValue)) {
              isMatch = false;
              break;
            }
          } else {
            // Comparación para otros tipos de datos
            if (dataValue.toString().toLowerCase().indexOf(filterValue.toLowerCase()) === -1) {
              isMatch = false;
              break;
            }
          }
        }
      }
      return isMatch;
    };
  }


  // Método para manejar los cliks en las acciones
  actionClick(action: any, element: any): void {
    this.actionClicked.emit({action, element});
  }

  // Evitar que se cambia la ordenacion cuando se oprime la barra espaciadora
  preventSpaceKey(event: KeyboardEvent): void {
    if (event.key === ' ') {
      event.stopPropagation();
    }
  }

}
