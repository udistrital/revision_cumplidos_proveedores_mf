import { Component, Input, OnInit } from '@angular/core';
import { InformacionComentarioIndividual } from 'src/app/models/informacion-comentario-individual';

@Component({
  selector: 'app-comentario-individual-soporte',
  templateUrl: './comentario-individual-soporte.component.html',
  styleUrls: ['./comentario-individual-soporte.component.scss']
})
export class ComentarioIndividualSoporteComponent implements OnInit {

  @Input() comentario!: InformacionComentarioIndividual;

  ngOnInit() {
  }
}
