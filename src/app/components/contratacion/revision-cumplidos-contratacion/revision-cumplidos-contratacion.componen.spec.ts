import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionCumplidosContratacionComponent } from './revision-cumplidos-contratacion.component';

describe('RevisionCumplidosContratacionComponent', () => {
  let component: RevisionCumplidosContratacionComponent;
  let fixture: ComponentFixture<RevisionCumplidosContratacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevisionCumplidosContratacionComponent]
    });
    fixture = TestBed.createComponent(RevisionCumplidosContratacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
