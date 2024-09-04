import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InformeSatisfaccionComponent } from './informe-satisfaccion.component';
describe('ComponentePrincipalComponent', () => {
  let component: InformeSatisfaccionComponent;
  let fixture: ComponentFixture<InformeSatisfaccionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InformeSatisfaccionComponent]
    });
    fixture = TestBed.createComponent(InformeSatisfaccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
