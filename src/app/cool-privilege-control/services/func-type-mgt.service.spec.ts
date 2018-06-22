import { TestBed, inject } from '@angular/core/testing';

import { FuncTypeMgtService } from './func-type-mgt.service';

describe('FuncTypeMgtService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FuncTypeMgtService]
    });
  });

  it('should be created', inject([FuncTypeMgtService], (service: FuncTypeMgtService) => {
    expect(service).toBeTruthy();
  }));
});
