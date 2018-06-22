import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLuserComponent } from './create-luser.component';

describe('CreateLuserComponent', () => {
  let component: CreateLuserComponent;
  let fixture: ComponentFixture<CreateLuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
