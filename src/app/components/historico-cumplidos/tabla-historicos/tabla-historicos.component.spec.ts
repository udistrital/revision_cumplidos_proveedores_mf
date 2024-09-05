import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaHistoricosComponent } from './tabla-historicos.component';

describe('TablaHistoricosComponent', () => {
  let component: TablaHistoricosComponent;
  let fixture: ComponentFixture<TablaHistoricosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaHistoricosComponent]
    });
    fixture = TestBed.createComponent(TablaHistoricosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
