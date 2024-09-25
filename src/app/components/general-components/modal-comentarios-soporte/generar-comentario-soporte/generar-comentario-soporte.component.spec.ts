import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarComentarioSoporteComponent } from './generar-comentario-soporte.component';

describe('GenerarComentarioSoporteComponent', () => {
  let component: GenerarComentarioSoporteComponent;
  let fixture: ComponentFixture<GenerarComentarioSoporteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerarComentarioSoporteComponent]
    });
    fixture = TestBed.createComponent(GenerarComentarioSoporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
