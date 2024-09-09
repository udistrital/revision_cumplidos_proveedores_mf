import { Component } from '@angular/core';

@Component({
  selector: 'app-modal-historico',
  templateUrl: './modal-historico.component.html',
  styleUrls: ['./modal-historico.component.css']
})
export class ModalHistoricoComponent {

   Estados = [
    {
      nombre: "John Smith",
      estado: "Embarca en el Mayflower",
      fecha: "1620-09-16",
      cargo: "Pilgrim Leader"
    },
    {
      nombre: "Elizabeth Bennett",
      estado: "Publicación de 'Orgullo y Prejuicio'",
      fecha: "1813-01-28",
      cargo: "Novelista"
    },
    {
      nombre: "Leonardo da Vinci",
      estado: "Pintura de 'La Mona Lisa'",
      fecha: "1503-06-01",
      cargo: "Artista e inventor"
    },
    {
      nombre: "Amelia Earhart",
      estado: "Primer vuelo transatlántico por una mujer",
      fecha: "1932-05-20",
      cargo: "Aviadora"
    },
    {
      nombre: "Nelson Mandela",
      estado: "Libertad tras 27 años de prisión",
      fecha: "1990-02-11",
      cargo: "Activista político"
    }
  ];
  

}
