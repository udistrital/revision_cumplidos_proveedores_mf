import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionCumplidosOrdenadorComponent } from './revision-cumplidos-ordenador.component';

describe('TablaAproabacionPagoComponent', () => {
  let component: RevisionCumplidosOrdenadorComponent;
  let fixture: ComponentFixture<RevisionCumplidosOrdenadorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevisionCumplidosOrdenadorComponent]
    });
    fixture = TestBed.createComponent(RevisionCumplidosOrdenadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
