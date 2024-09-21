import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComentarioIndividualSoporteComponent } from './comentario-individual-soporte.component';

describe('ComentarioIndividualSoporteComponent', () => {
  let component: ComentarioIndividualSoporteComponent;
  let fixture: ComponentFixture<ComentarioIndividualSoporteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComentarioIndividualSoporteComponent]
    });
    fixture = TestBed.createComponent(ComentarioIndividualSoporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
