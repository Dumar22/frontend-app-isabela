import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMeterComponent } from './add-edit-meter.component';

describe('AddEditMeterComponent', () => {
  let component: AddEditMeterComponent;
  let fixture: ComponentFixture<AddEditMeterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddEditMeterComponent]
    });
    fixture = TestBed.createComponent(AddEditMeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
