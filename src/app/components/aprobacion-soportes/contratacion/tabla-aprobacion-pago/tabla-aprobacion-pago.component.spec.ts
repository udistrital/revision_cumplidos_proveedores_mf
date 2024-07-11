import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaAprobacionPagoComponent } from './tabla-aprobacion-pago.component';

describe('TablaAprobacionPagoComponent', () => {
  let component: TablaAprobacionPagoComponent;
  let fixture: ComponentFixture<TablaAprobacionPagoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaAprobacionPagoComponent]
    });
    fixture = TestBed.createComponent(TablaAprobacionPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
