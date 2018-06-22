import { LuserMgtModule } from './luser-mgt.module';

describe('LuserMgtModule', () => {
  let luserMgtModule: LuserMgtModule;

  beforeEach(() => {
    luserMgtModule = new LuserMgtModule();
  });

  it('should create an instance', () => {
    expect(luserMgtModule).toBeTruthy();
  });
});
