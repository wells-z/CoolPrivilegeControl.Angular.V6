import { LangMgtModule } from './lang-mgt.module';

describe('LangMgtModule', () => {
  let langMgtModule: LangMgtModule;

  beforeEach(() => {
    langMgtModule = new LangMgtModule();
  });

  it('should create an instance', () => {
    expect(langMgtModule).toBeTruthy();
  });
});
