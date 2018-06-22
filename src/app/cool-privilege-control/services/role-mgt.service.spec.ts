import { TestBed, inject } from '@angular/core/testing';

import { RoleMgtService } from './role-mgt.service';

describe('RoleMgtService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoleMgtService]
    });
  });

  it('should be created', inject([RoleMgtService], (service: RoleMgtService) => {
    expect(service).toBeTruthy();
  }));
});
