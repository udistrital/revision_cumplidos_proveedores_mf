import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalListarCumplidosComponent } from './modal-listar-cumplidos.component';

describe('ModalListarCumplidosComponent', () => {
  let component: ModalListarCumplidosComponent;
  let fixture: ComponentFixture<ModalListarCumplidosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalListarCumplidosComponent]
    });
    fixture = TestBed.createComponent(ModalListarCumplidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
