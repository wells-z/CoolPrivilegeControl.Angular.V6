import { FuncTypeMgtModule } from './func-type-mgt.module';

describe('FuncTypeMgtModule', () => {
  let funcTypeMgtModule: FuncTypeMgtModule;

  beforeEach(() => {
    funcTypeMgtModule = new FuncTypeMgtModule();
  });

  it('should create an instance', () => {
    expect(funcTypeMgtModule).toBeTruthy();
  });
});
