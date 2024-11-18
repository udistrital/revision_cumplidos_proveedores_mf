import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEvaluacionContratoComponent } from './form-evaluacion-contrato.component';

describe('FormEvaluacionContratoComponent', () => {
  let component: FormEvaluacionContratoComponent;
  let fixture: ComponentFixture<FormEvaluacionContratoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormEvaluacionContratoComponent]
    });
    fixture = TestBed.createComponent(FormEvaluacionContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
