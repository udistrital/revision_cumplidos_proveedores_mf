import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioInformeSeguimientoComponent } from './formulario-informe-seguimiento.component';

describe('FormularioInformeSeguimientoComponent', () => {
  let component: FormularioInformeSeguimientoComponent;
  let fixture: ComponentFixture<FormularioInformeSeguimientoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormularioInformeSeguimientoComponent]
    });
    fixture = TestBed.createComponent(FormularioInformeSeguimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
