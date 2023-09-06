import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailExitSeriesComponent } from './detail-exit-series.component';

describe('DetailExitSeriesComponent', () => {
  let component: DetailExitSeriesComponent;
  let fixture: ComponentFixture<DetailExitSeriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DetailExitSeriesComponent]
    });
    fixture = TestBed.createComponent(DetailExitSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
