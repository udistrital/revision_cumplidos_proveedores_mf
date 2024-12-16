import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarResultadoEvaluacionComponent } from './visualizar-resultado-evaluacion.component';

describe('VisualizarResultadoEvaluacionComponent', () => {
  let component: VisualizarResultadoEvaluacionComponent;
  let fixture: ComponentFixture<VisualizarResultadoEvaluacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizarResultadoEvaluacionComponent]
    });
    fixture = TestBed.createComponent(VisualizarResultadoEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
