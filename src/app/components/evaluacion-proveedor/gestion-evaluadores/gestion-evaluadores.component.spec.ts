import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionEvaluadoresComponent } from './gestion-evaluadores.component';

describe('GestionEvaluadoresComponent', () => {
  let component: GestionEvaluadoresComponent;
  let fixture: ComponentFixture<GestionEvaluadoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionEvaluadoresComponent]
    });
    fixture = TestBed.createComponent(GestionEvaluadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
