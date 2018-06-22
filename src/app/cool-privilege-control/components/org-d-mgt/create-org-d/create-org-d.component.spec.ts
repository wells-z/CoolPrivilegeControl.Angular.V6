import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrgDComponent } from './create-org-d.component';

describe('CreateOrgDComponent', () => {
  let component: CreateOrgDComponent;
  let fixture: ComponentFixture<CreateOrgDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateOrgDComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrgDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
