import { TestBed } from '@angular/core/testing';

import { Societes } from './societes';

describe('Societes', () => {
  let service: Societes;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Societes);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
