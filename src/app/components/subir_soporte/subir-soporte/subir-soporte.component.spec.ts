import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirSoporteComponent } from './subir-soporte.component';

describe('SubirSoporteComponent', () => {
  let component: SubirSoporteComponent;
  let fixture: ComponentFixture<SubirSoporteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubirSoporteComponent]
    });
    fixture = TestBed.createComponent(SubirSoporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
