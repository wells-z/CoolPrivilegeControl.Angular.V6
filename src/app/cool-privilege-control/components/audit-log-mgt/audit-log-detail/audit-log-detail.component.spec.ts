import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditLogDetailComponent } from './audit-log-detail.component';

describe('AuditLogDetailComponent', () => {
  let component: AuditLogDetailComponent;
  let fixture: ComponentFixture<AuditLogDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditLogDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditLogDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
