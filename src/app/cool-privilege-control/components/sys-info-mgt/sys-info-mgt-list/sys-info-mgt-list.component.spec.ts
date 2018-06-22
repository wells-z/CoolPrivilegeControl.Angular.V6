import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysInfoMgtListComponent } from './sys-info-mgt-list.component';

describe('SysInfoMgtListComponent', () => {
  let component: SysInfoMgtListComponent;
  let fixture: ComponentFixture<SysInfoMgtListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysInfoMgtListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysInfoMgtListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
