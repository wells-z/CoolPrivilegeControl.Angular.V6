import { FuncMgtModule } from './func-mgt.module';

describe('FuncMgtModule', () => {
  let funcMgtModule: FuncMgtModule;

  beforeEach(() => {
    funcMgtModule = new FuncMgtModule();
  });

  it('should create an instance', () => {
    expect(funcMgtModule).toBeTruthy();
  });
});
