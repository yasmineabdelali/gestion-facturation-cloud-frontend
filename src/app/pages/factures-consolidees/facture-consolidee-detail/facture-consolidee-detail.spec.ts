import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureConsolideeDetail } from './facture-consolidee-detail';

describe('FactureConsolideeDetail', () => {
  let component: FactureConsolideeDetail;
  let fixture: ComponentFixture<FactureConsolideeDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactureConsolideeDetail]
    }).compileComponents();

    fixture = TestBed.createComponent(FactureConsolideeDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
