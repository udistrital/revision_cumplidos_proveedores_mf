import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentePrincipalComponent } from './componente-principal.component';
describe('ComponentePrincipalComponent', () => {
  let component: ComponentePrincipalComponent;
  let fixture: ComponentFixture<ComponentePrincipalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComponentePrincipalComponent]
    });
    fixture = TestBed.createComponent(ComponentePrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
