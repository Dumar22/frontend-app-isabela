import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditWorkRegisterComponent } from './add-edit-work-register.component';

describe('AddEditWorkRegisterComponent', () => {
  let component: AddEditWorkRegisterComponent;
  let fixture: ComponentFixture<AddEditWorkRegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddEditWorkRegisterComponent]
    });
    fixture = TestBed.createComponent(AddEditWorkRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
