import { TestBed, inject } from '@angular/core/testing';

import { AuditLogMgtService } from './audit-log-mgt.service';

describe('AuditLogMgtService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuditLogMgtService]
    });
  });

  it('should be created', inject([AuditLogMgtService], (service: AuditLogMgtService) => {
    expect(service).toBeTruthy();
  }));
});
