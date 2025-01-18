import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComentariosSoporteComponent } from './modal-comentarios-soporte.component';

describe('ModalComentariosSoporteComponent', () => {
  let component: ModalComentariosSoporteComponent;
  let fixture: ComponentFixture<ModalComentariosSoporteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalComentariosSoporteComponent]
    });
    fixture = TestBed.createComponent(ModalComentariosSoporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
