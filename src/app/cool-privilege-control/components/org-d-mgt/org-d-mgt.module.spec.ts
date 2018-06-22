import { OrgDMgtModule } from './org-d-mgt.module';

describe('OrgDMgtModule', () => {
  let orgDMgtModule: OrgDMgtModule;

  beforeEach(() => {
    orgDMgtModule = new OrgDMgtModule();
  });

  it('should create an instance', () => {
    expect(orgDMgtModule).toBeTruthy();
  });
});
