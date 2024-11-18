import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsAEvaluarComponent } from './items-a-evaluar.component';

describe('ItemsAEvaluarComponent', () => {
  let component: ItemsAEvaluarComponent;
  let fixture: ComponentFixture<ItemsAEvaluarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemsAEvaluarComponent]
    });
    fixture = TestBed.createComponent(ItemsAEvaluarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
