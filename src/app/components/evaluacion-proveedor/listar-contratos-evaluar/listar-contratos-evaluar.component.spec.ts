import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarContratosEvaluarComponent } from './listar-contratos-evaluar.component';

describe('ListarContratosEvaluarComponent', () => {
  let component: ListarContratosEvaluarComponent;
  let fixture: ComponentFixture<ListarContratosEvaluarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarContratosEvaluarComponent]
    });
    fixture = TestBed.createComponent(ListarContratosEvaluarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
