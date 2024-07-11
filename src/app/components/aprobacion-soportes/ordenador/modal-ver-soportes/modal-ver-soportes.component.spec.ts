import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVerSoportesComponentOrdenador } from './modal-ver-soportes.component';

describe('ModalVerSoportesComponent', () => {
  let component: ModalVerSoportesComponentOrdenador;
  let fixture: ComponentFixture<ModalVerSoportesComponentOrdenador>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalVerSoportesComponentOrdenador]
    });
    fixture = TestBed.createComponent(ModalVerSoportesComponentOrdenador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
