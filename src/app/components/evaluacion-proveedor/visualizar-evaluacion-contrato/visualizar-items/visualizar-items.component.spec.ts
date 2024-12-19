import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarItemsComponent } from './visualizar-items.component';

describe('VisualizarItemsComponent', () => {
  let component: VisualizarItemsComponent;
  let fixture: ComponentFixture<VisualizarItemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizarItemsComponent]
    });
    fixture = TestBed.createComponent(VisualizarItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
