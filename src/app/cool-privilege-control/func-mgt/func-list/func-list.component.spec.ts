import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncListComponent } from './func-list.component';

describe('FuncListComponent', () => {
  let component: FuncListComponent;
  let fixture: ComponentFixture<FuncListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuncListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuncListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
