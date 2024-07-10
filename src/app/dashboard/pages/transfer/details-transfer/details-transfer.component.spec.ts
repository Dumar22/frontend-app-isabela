import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsTransferComponent } from './details-transfer.component';

describe('DetailsTransferComponent', () => {
  let component: DetailsTransferComponent;
  let fixture: ComponentFixture<DetailsTransferComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DetailsTransferComponent]
    });
    fixture = TestBed.createComponent(DetailsTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
