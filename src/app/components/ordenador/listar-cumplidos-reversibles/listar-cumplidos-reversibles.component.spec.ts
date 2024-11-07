import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarCumplidosReversiblesComponent } from './listar-cumplidos-reversibles.component';

describe('ListarCumplidosReversiblesComponent', () => {
  let component: ListarCumplidosReversiblesComponent;
  let fixture: ComponentFixture<ListarCumplidosReversiblesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarCumplidosReversiblesComponent]
    });
    fixture = TestBed.createComponent(ListarCumplidosReversiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
