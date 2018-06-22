import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLuserComponent } from './edit-luser.component';

describe('EditLuserComponent', () => {
  let component: EditLuserComponent;
  let fixture: ComponentFixture<EditLuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
