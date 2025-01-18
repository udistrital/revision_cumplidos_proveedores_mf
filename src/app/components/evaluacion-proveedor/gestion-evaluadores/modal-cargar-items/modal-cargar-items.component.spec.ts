import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCargarItemsComponent } from './modal-cargar-items.component';

describe('ModalCargarItemsComponent', () => {
  let component: ModalCargarItemsComponent;
  let fixture: ComponentFixture<ModalCargarItemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalCargarItemsComponent]
    });
    fixture = TestBed.createComponent(ModalCargarItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
