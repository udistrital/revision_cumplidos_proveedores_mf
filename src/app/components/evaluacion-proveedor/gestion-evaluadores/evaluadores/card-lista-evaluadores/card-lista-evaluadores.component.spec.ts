import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardListaEvaluadoresComponent } from './card-lista-evaluadores.component';

describe('CardListaEvaluadoresComponent', () => {
  let component: CardListaEvaluadoresComponent;
  let fixture: ComponentFixture<CardListaEvaluadoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardListaEvaluadoresComponent]
    });
    fixture = TestBed.createComponent(CardListaEvaluadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
