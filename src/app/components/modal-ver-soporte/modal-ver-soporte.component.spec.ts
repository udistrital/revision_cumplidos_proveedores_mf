import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVerSoporteComponent } from './modal-ver-soporte.component';

describe('ModalVerSoporteComponent', () => {
  let component: ModalVerSoporteComponent;
  let fixture: ComponentFixture<ModalVerSoporteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalVerSoporteComponent]
    });
    fixture = TestBed.createComponent(ModalVerSoporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
