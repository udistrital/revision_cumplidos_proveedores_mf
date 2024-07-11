import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCargaSoprotesComponent } from './modal-carga-soprotes.component';

describe('ModalCargaSoprotesComponent', () => {
  let component: ModalCargaSoprotesComponent;
  let fixture: ComponentFixture<ModalCargaSoprotesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalCargaSoprotesComponent]
    });
    fixture = TestBed.createComponent(ModalCargaSoprotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
