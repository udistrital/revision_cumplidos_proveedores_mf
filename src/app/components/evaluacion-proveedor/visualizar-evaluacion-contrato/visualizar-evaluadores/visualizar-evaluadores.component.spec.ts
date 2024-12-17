import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarEvaluadoresComponent } from './visualizar-evaluadores.component';

describe('VisualizarEvaluadoresComponent', () => {
  let component: VisualizarEvaluadoresComponent;
  let fixture: ComponentFixture<VisualizarEvaluadoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizarEvaluadoresComponent]
    });
    fixture = TestBed.createComponent(VisualizarEvaluadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
