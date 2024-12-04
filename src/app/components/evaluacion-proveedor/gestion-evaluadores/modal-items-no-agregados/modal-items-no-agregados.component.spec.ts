import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalItemsNoAgregadosComponent } from './modal-items-no-agregados.component';

describe('ModalItemsNoAgregadosComponent', () => {
  let component: ModalItemsNoAgregadosComponent;
  let fixture: ComponentFixture<ModalItemsNoAgregadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalItemsNoAgregadosComponent]
    });
    fixture = TestBed.createComponent(ModalItemsNoAgregadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
