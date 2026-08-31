import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocieteForm } from './societe-form';

describe('SocieteForm', () => {
  let component: SocieteForm;
  let fixture: ComponentFixture<SocieteForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocieteForm]
    }).compileComponents();

    fixture = TestBed.createComponent(SocieteForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
