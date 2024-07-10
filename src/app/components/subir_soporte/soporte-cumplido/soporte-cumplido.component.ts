import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-soporte-cumplido',
  templateUrl: './soporte-cumplido.component.html',
  styleUrls: ['./soporte-cumplido.component.css']
})
export class SoporteCumplidoComponent {

  @Input() nombre!: string;
  @Input() fecha!: Date;
  @Input() item!: string;
  @Input() comentario!: string;
}
