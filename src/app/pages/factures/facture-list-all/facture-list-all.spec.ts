import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureListAll } from './facture-list-all';

describe('FactureListAll', () => {
  let component: FactureListAll;
  let fixture: ComponentFixture<FactureListAll>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactureListAll]
    }).compileComponents();

    fixture = TestBed.createComponent(FactureListAll);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
