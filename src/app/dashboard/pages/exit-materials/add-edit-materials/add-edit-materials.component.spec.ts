import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMaterialsComponent } from './add-edit-materials.component';

describe('AddEditMaterialsComponent', () => {
  let component: AddEditMaterialsComponent;
  let fixture: ComponentFixture<AddEditMaterialsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddEditMaterialsComponent]
    });
    fixture = TestBed.createComponent(AddEditMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
