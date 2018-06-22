import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncTypeListComponent } from './func-type-list.component';

describe('FuncTypeListComponent', () => {
  let component: FuncTypeListComponent;
  let fixture: ComponentFixture<FuncTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuncTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuncTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
