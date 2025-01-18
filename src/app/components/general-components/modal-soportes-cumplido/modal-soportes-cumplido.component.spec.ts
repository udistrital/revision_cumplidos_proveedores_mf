import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSoportesCumplidoComponent } from './modal-soportes-cumplido.component';

describe('ModalSoportesCumplidoComponent', () => {
  let component: ModalSoportesCumplidoComponent;
  let fixture: ComponentFixture<ModalSoportesCumplidoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalSoportesCumplidoComponent]
    });
    fixture = TestBed.createComponent(ModalSoportesCumplidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
