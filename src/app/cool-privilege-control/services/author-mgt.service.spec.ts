import { TestBed, inject } from '@angular/core/testing';

import { AuthorMgtService } from './author-mgt.service';

describe('AuthorMgtService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthorMgtService]
    });
  });

  it('should be created', inject([AuthorMgtService], (service: AuthorMgtService) => {
    expect(service).toBeTruthy();
  }));
});
