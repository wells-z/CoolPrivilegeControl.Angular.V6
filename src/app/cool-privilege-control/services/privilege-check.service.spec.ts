import { TestBed, inject } from '@angular/core/testing';

import { PrivilegeCheckService } from './privilege-check.service';

describe('PrivilegeCheckService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrivilegeCheckService]
    });
  });

  it('should be created', inject([PrivilegeCheckService], (service: PrivilegeCheckService) => {
    expect(service).toBeTruthy();
  }));
});
