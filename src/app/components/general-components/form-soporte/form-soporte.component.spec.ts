import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSoporteComponent } from './form-soporte.component';

describe('FormSoporteComponent', () => {
  let component: FormSoporteComponent;
  let fixture: ComponentFixture<FormSoporteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormSoporteComponent]
    });
    fixture = TestBed.createComponent(FormSoporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
