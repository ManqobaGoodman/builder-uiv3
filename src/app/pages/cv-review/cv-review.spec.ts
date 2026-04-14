import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvReview } from './cv-review';

describe('CvReview', () => {
  let component: CvReview;
  let fixture: ComponentFixture<CvReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvReview],
    }).compileComponents();

    fixture = TestBed.createComponent(CvReview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
