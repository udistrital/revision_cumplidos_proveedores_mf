import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVerSoportesComponent } from './modal-ver-soportes.component';

describe('ModalVerSoportesComponent', () => {
  let component: ModalVerSoportesComponent;
  let fixture: ComponentFixture<ModalVerSoportesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalVerSoportesComponent]
    });
    fixture = TestBed.createComponent(ModalVerSoportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
