import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocieteDetail } from './societe-detail';

describe('SocieteDetail', () => {
  let component: SocieteDetail;
  let fixture: ComponentFixture<SocieteDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocieteDetail]
    }).compileComponents();

    fixture = TestBed.createComponent(SocieteDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
