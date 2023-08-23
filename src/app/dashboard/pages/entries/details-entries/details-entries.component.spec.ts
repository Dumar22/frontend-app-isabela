import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsEntriesComponent } from './details-entries.component';

describe('DetailsEntriesComponent', () => {
  let component: DetailsEntriesComponent;
  let fixture: ComponentFixture<DetailsEntriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DetailsEntriesComponent]
    });
    fixture = TestBed.createComponent(DetailsEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
