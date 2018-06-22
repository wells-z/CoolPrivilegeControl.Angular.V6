import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFuncTypeComponent } from './edit-func-type.component';

describe('EditFuncTypeComponent', () => {
  let component: EditFuncTypeComponent;
  let fixture: ComponentFixture<EditFuncTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFuncTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFuncTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
