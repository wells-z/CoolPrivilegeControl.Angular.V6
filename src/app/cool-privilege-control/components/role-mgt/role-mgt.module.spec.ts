import { RoleMgtModule } from './role-mgt.module';

describe('RoleMgtModule', () => {
  let roleMgtModule: RoleMgtModule;

  beforeEach(() => {
    roleMgtModule = new RoleMgtModule();
  });

  it('should create an instance', () => {
    expect(roleMgtModule).toBeTruthy();
  });
});
