import { AuditLogMgtModule } from './audit-log-mgt.module';

describe('AuditLogMgtModule', () => {
  let auditLogMgtModule: AuditLogMgtModule;

  beforeEach(() => {
    auditLogMgtModule = new AuditLogMgtModule();
  });

  it('should create an instance', () => {
    expect(auditLogMgtModule).toBeTruthy();
  });
});
