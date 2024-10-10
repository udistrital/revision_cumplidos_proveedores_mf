import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoHistoricosComponent } from './listado-historicos.component';

describe('TablaHistoricosComponent', () => {
  let component: ListadoHistoricosComponent;
  let fixture: ComponentFixture<ListadoHistoricosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListadoHistoricosComponent]
    });
    fixture = TestBed.createComponent(ListadoHistoricosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
