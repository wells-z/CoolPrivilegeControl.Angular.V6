import { TestBed, inject } from '@angular/core/testing';

import { OrgMgtService } from './org-mgt.service';

describe('OrgMgtService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrgMgtService]
    });
  });

  it('should be created', inject([OrgMgtService], (service: OrgMgtService) => {
    expect(service).toBeTruthy();
  }));
});
