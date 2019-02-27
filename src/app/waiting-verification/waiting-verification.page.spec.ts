import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingVerificationPage } from './waiting-verification.page';

describe('WaitingVerificationPage', () => {
  let component: WaitingVerificationPage;
  let fixture: ComponentFixture<WaitingVerificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingVerificationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingVerificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
