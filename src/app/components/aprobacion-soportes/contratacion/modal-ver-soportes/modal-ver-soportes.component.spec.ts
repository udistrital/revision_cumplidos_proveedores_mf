import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVerSoportesComponentContratacion } from './modal-ver-soportes.component';

describe('ModalVerSoportesComponent', () => {
  let component: ModalVerSoportesComponentContratacion;
  let fixture: ComponentFixture<ModalVerSoportesComponentContratacion>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalVerSoportesComponentContratacion]
    });
    fixture = TestBed.createComponent(ModalVerSoportesComponentContratacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
