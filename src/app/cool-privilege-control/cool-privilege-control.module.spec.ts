import { CoolPrivilegeControlModule } from './cool-privilege-control.module';

describe('CoolPrivilegeControlModule', () => {
  let coolPrivilegeControlModule: CoolPrivilegeControlModule;

  beforeEach(() => {
    coolPrivilegeControlModule = new CoolPrivilegeControlModule();
  });

  it('should create an instance', () => {
    expect(coolPrivilegeControlModule).toBeTruthy();
  });
});
