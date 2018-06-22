import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedLuserOrgComponent } from './selected-luser-org.component';

describe('SelectedLuserOrgComponent', () => {
  let component: SelectedLuserOrgComponent;
  let fixture: ComponentFixture<SelectedLuserOrgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedLuserOrgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedLuserOrgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
