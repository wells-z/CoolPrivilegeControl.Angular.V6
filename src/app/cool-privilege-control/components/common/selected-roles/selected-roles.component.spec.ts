import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedRolesComponent } from './selected-roles.component';

describe('SelectedRolesComponent', () => {
  let component: SelectedRolesComponent;
  let fixture: ComponentFixture<SelectedRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
