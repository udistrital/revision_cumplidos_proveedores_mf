import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalListarSoportes } from './modal-listar-soportes.component';

describe('ModalListarSoportes', () => {
  let component: ModalListarSoportes;
  let fixture: ComponentFixture<ModalListarSoportes>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalListarSoportes]
    });
    fixture = TestBed.createComponent(ModalListarSoportes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
