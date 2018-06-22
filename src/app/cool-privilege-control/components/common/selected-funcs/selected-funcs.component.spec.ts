import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedFuncsComponent } from './selected-funcs.component';

describe('SelectedFuncsComponent', () => {
  let component: SelectedFuncsComponent;
  let fixture: ComponentFixture<SelectedFuncsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedFuncsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedFuncsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
