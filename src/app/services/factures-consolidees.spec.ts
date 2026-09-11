import { TestBed } from '@angular/core/testing';

import { FacturesConsolidees } from './factures-consolidees';

describe('FacturesConsolidees', () => {
  let service: FacturesConsolidees;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacturesConsolidees);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
