import { TestBed } from '@angular/core/testing';

import { Factures } from './factures';

describe('Factures', () => {
  let service: Factures;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Factures);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
