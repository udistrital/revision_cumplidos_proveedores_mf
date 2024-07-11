import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaAproabacionPagoComponent } from './tabla-aproabacion-pago.component';

describe('TablaAproabacionPagoComponent', () => {
  let component: TablaAproabacionPagoComponent;
  let fixture: ComponentFixture<TablaAproabacionPagoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaAproabacionPagoComponent]
    });
    fixture = TestBed.createComponent(TablaAproabacionPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
