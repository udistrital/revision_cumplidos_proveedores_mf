import { Component, Input, ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
  selector: 'app-listar-elementos',
  templateUrl: './listar-elementos.component.html',
  styleUrls: ['./listar-elementos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListarElementosComponent {

  @Input({required:true})tittle!:string
  @Input({required:true})lista!: string[]
  readonly panelOpenState = signal(false);



}
