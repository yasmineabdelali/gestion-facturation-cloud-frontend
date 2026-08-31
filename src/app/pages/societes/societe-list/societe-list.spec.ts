import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocieteList } from './societe-list';

describe('SocieteList', () => {
  let component: SocieteList;
  let fixture: ComponentFixture<SocieteList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocieteList]
    }).compileComponents();

    fixture = TestBed.createComponent(SocieteList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
