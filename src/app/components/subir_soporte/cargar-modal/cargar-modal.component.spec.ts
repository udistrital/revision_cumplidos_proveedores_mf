import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarModalComponent } from './cargar-modal.component';

describe('CargarModalComponent', () => {
  let component: CargarModalComponent;
  let fixture: ComponentFixture<CargarModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CargarModalComponent]
    });
    fixture = TestBed.createComponent(CargarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
