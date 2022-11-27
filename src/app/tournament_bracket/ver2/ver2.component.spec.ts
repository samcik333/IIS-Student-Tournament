import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ver2Component } from './ver2.component';

describe('Ver2Component', () => {
  let component: Ver2Component;
  let fixture: ComponentFixture<Ver2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ver2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ver2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
