import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVisualizarSoporteComponent } from './modal-visualizar-soporte.component';

describe('ModalVisualizarSoporteComponent', () => {
  let component: ModalVisualizarSoporteComponent;
  let fixture: ComponentFixture<ModalVisualizarSoporteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalVisualizarSoporteComponent]
    });
    fixture = TestBed.createComponent(ModalVisualizarSoporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
