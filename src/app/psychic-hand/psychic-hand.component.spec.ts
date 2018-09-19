import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PsychicHandComponent } from './psychic-hand.component';

describe('PsychicHandComponent', () => {
  let component: PsychicHandComponent;
  let fixture: ComponentFixture<PsychicHandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PsychicHandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PsychicHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
