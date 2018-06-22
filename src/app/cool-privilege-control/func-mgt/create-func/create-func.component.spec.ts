import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFuncComponent } from './create-func.component';

describe('CreateFuncComponent', () => {
  let component: CreateFuncComponent;
  let fixture: ComponentFixture<CreateFuncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFuncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFuncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
