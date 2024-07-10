import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarSoportesComponent } from './visualizar-soportes.component';

describe('VisualizarSoportesComponent', () => {
  let component: VisualizarSoportesComponent;
  let fixture: ComponentFixture<VisualizarSoportesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizarSoportesComponent]
    });
    fixture = TestBed.createComponent(VisualizarSoportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
