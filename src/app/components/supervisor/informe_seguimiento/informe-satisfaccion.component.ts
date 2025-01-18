import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-informe_seguimiento',
  templateUrl: './informe-satisfaccion.component.html',
  styleUrls: ['./informe-satisfaccion.component.scss']
})
export class InformeSatisfaccionComponent {

  title = 'CUMPLIDO A SATISFACCIÓN'

  constructor(private router: Router,) { }

  ngOnInit(): void {
  }

  regresar_supervisor(){
    this.router.navigate(['/supervisor/subir-soportes'])
  }
}
