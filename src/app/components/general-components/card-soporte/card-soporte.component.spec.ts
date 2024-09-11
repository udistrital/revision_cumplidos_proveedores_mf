import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSoporteComponent } from './card-soporte.component';

describe('CardSoporteComponent', () => {
  let component: CardSoporteComponent;
  let fixture: ComponentFixture<CardSoporteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardSoporteComponent]
    });
    fixture = TestBed.createComponent(CardSoporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
