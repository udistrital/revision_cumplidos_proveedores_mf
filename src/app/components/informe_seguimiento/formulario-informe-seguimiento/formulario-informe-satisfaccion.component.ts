import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioInformeSatisfaccionComponent } from './formulario-informe-seguimiento.component';

describe('FormularioInformeSeguimientoComponent', () => {
  let component: FormularioInformeSatisfaccionComponent ;
  let fixture: ComponentFixture<FormularioInformeSatisfaccionComponent >;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormularioInformeSatisfaccionComponent ]
    });
    fixture = TestBed.createComponent(FormularioInformeSatisfaccionComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
