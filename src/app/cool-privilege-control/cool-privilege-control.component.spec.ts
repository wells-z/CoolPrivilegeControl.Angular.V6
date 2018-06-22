import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoolPrivilegeControlComponent } from './cool-privilege-control.component';

describe('CoolPrivilegeControlComponent', () => {
  let component: CoolPrivilegeControlComponent;
  let fixture: ComponentFixture<CoolPrivilegeControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoolPrivilegeControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoolPrivilegeControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
