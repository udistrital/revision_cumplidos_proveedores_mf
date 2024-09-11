import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaAprobacionPagoOrdenadorComponent } from './tabla-aprobacion-pago-ordenador.component';

describe('TablaAproabacionPagoComponent', () => {
  let component: TablaAprobacionPagoOrdenadorComponent;
  let fixture: ComponentFixture<TablaAprobacionPagoOrdenadorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaAprobacionPagoOrdenadorComponent]
    });
    fixture = TestBed.createComponent(TablaAprobacionPagoOrdenadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
