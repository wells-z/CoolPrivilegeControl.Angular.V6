import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFuncTypeComponent } from './create-func-type.component';

describe('CreateFuncTypeComponent', () => {
  let component: CreateFuncTypeComponent;
  let fixture: ComponentFixture<CreateFuncTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFuncTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFuncTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
