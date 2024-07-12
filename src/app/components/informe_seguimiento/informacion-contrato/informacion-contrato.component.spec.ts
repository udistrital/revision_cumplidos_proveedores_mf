import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionContratoComponent } from './informacion-contrato.component';

describe('InformacionContratoComponent', () => {
  let component: InformacionContratoComponent;
  let fixture: ComponentFixture<InformacionContratoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InformacionContratoComponent]
    });
    fixture = TestBed.createComponent(InformacionContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
