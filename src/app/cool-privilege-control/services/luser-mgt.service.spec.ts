import { TestBed, inject } from '@angular/core/testing';

import { LuserMgtService } from './luser-mgt.service';

describe('LuserMgtService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LuserMgtService]
    });
  });

  it('should be created', inject([LuserMgtService], (service: LuserMgtService) => {
    expect(service).toBeTruthy();
  }));
});
