import { TestBed, inject } from '@angular/core/testing';

import { FuncMgtService } from './func-mgt.service';

describe('FuncMgtService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FuncMgtService]
    });
  });

  it('should be created', inject([FuncMgtService], (service: FuncMgtService) => {
    expect(service).toBeTruthy();
  }));
});
