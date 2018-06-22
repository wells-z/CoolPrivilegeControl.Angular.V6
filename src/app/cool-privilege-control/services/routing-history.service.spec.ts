import { TestBed, inject } from '@angular/core/testing';

import { RoutingHistoryService } from './routing-history.service';

describe('RoutingHistoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoutingHistoryService]
    });
  });

  it('should be created', inject([RoutingHistoryService], (service: RoutingHistoryService) => {
    expect(service).toBeTruthy();
  }));
});
