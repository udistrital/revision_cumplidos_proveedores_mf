import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaCargaSoportesComponent } from './tabla-carga-soportes.component';

describe('TablaCargaSoportesComponent', () => {
  let component: TablaCargaSoportesComponent;
  let fixture: ComponentFixture<TablaCargaSoportesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaCargaSoportesComponent]
    });
    fixture = TestBed.createComponent(TablaCargaSoportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
