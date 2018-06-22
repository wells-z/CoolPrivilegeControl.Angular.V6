import { AuthorMgtModule } from './author-mgt.module';

describe('AuthorMgtModule', () => {
  let authorMgtModule: AuthorMgtModule;

  beforeEach(() => {
    authorMgtModule = new AuthorMgtModule();
  });

  it('should create an instance', () => {
    expect(authorMgtModule).toBeTruthy();
  });
});
