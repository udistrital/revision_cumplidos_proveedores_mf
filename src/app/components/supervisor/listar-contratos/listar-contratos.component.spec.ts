import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarContratosComponent } from './listar-contratos.component';

describe('ListarContratoComponent', () => {
  let component: ListarContratosComponent;
  let fixture: ComponentFixture<ListarContratosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarContratosComponent]
    });
    fixture = TestBed.createComponent(ListarContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
