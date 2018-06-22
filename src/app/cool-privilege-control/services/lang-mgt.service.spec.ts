import { TestBed, inject } from '@angular/core/testing';

import { LangMgtService } from './lang-mgt.service';

describe('LangMgtService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LangMgtService]
    });
  });

  it('should be created', inject([LangMgtService], (service: LangMgtService) => {
    expect(service).toBeTruthy();
  }));
});
