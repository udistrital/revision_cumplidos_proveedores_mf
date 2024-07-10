import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoporteCumplidoComponent } from './soporte-cumplido.component';

describe('SoporteCumplidoComponent', () => {
  let component: SoporteCumplidoComponent;
  let fixture: ComponentFixture<SoporteCumplidoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SoporteCumplidoComponent]
    });
    fixture = TestBed.createComponent(SoporteCumplidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
