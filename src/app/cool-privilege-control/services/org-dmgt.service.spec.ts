import { TestBed, inject } from '@angular/core/testing';

import { OrgDmgtService } from './org-dmgt.service';

describe('OrgDmgtService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrgDmgtService]
    });
  });

  it('should be created', inject([OrgDmgtService], (service: OrgDmgtService) => {
    expect(service).toBeTruthy();
  }));
});
