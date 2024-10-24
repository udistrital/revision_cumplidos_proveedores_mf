import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoCumplidosComponent } from './historico-cumplidos.component';

describe('HistoricoCumplidosComponent', () => {
  let component: HistoricoCumplidosComponent;
  let fixture: ComponentFixture<HistoricoCumplidosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoricoCumplidosComponent]
    });
    fixture = TestBed.createComponent(HistoricoCumplidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
