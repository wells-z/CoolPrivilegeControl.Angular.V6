import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrgDComponent } from './edit-org-d.component';

describe('EditOrgDComponent', () => {
  let component: EditOrgDComponent;
  let fixture: ComponentFixture<EditOrgDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOrgDComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOrgDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
