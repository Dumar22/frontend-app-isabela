import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTransferComponent } from './add-edit-transfer.component';

describe('AddEditTransferComponent', () => {
  let component: AddEditTransferComponent;
  let fixture: ComponentFixture<AddEditTransferComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddEditTransferComponent]
    });
    fixture = TestBed.createComponent(AddEditTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
