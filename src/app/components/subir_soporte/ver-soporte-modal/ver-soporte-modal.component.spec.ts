import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerSoporteModalComponent } from './ver-soporte-modal.component';

describe('VerSoporteModalComponent', () => {
  let component: VerSoporteModalComponent;
  let fixture: ComponentFixture<VerSoporteModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerSoporteModalComponent]
    });
    fixture = TestBed.createComponent(VerSoporteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
