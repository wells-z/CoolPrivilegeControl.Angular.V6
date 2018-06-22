import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgDListComponent } from './org-d-list.component';

describe('OrgDListComponent', () => {
  let component: OrgDListComponent;
  let fixture: ComponentFixture<OrgDListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgDListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgDListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
