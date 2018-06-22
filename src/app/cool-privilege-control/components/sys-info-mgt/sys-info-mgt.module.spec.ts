import { SysInfoMgtModule } from './sys-info-mgt.module';

describe('SysInfoMgtModule', () => {
  let sysInfoMgtModule: SysInfoMgtModule;

  beforeEach(() => {
    sysInfoMgtModule = new SysInfoMgtModule();
  });

  it('should create an instance', () => {
    expect(sysInfoMgtModule).toBeTruthy();
  });
});
