import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPreguntaComponent } from './card-pregunta.component';

describe('CardPreguntaComponent', () => {
  let component: CardPreguntaComponent;
  let fixture: ComponentFixture<CardPreguntaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardPreguntaComponent]
    });
    fixture = TestBed.createComponent(CardPreguntaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
