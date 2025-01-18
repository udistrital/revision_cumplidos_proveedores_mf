import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarEvaluacionContratoComponent } from './visualizar-evaluacion-contrato.component';

describe('VisualizarEvaluacionContratoComponent', () => {
  let component: VisualizarEvaluacionContratoComponent;
  let fixture: ComponentFixture<VisualizarEvaluacionContratoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizarEvaluacionContratoComponent]
    });
    fixture = TestBed.createComponent(VisualizarEvaluacionContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
