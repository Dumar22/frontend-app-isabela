import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWorkRegisterComponent } from './list-work-register.component';

describe('ListWorkRegisterComponent', () => {
  let component: ListWorkRegisterComponent;
  let fixture: ComponentFixture<ListWorkRegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ListWorkRegisterComponent]
    });
    fixture = TestBed.createComponent(ListWorkRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
