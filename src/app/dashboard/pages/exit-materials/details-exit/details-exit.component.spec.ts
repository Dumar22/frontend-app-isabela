import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsExitComponent } from './details-exit.component';

describe('DetailsExitComponent', () => {
  let component: DetailsExitComponent;
  let fixture: ComponentFixture<DetailsExitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DetailsExitComponent]
    });
    fixture = TestBed.createComponent(DetailsExitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
