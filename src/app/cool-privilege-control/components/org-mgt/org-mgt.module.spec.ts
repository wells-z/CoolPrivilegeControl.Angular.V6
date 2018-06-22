import { OrgMgtModule } from './org-mgt.module';

describe('OrgMgtModule', () => {
  let orgMgtModule: OrgMgtModule;

  beforeEach(() => {
    orgMgtModule = new OrgMgtModule();
  });

  it('should create an instance', () => {
    expect(orgMgtModule).toBeTruthy();
  });
});
