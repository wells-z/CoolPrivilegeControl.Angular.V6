import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLangComponent } from './create-lang.component';

describe('CreateLangComponent', () => {
  let component: CreateLangComponent;
  let fixture: ComponentFixture<CreateLangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLangComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
