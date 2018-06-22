import { TestBed, inject } from '@angular/core/testing';

import { SysInfoMgtService } from './sys-info-mgt.service';

describe('SysInfoMgtService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SysInfoMgtService]
    });
  });

  it('should be created', inject([SysInfoMgtService], (service: SysInfoMgtService) => {
    expect(service).toBeTruthy();
  }));
});
