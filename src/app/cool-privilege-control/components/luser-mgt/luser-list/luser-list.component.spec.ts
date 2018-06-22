import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LuserListComponent } from './luser-list.component';

describe('LuserListComponent', () => {
  let component: LuserListComponent;
  let fixture: ComponentFixture<LuserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LuserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LuserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
