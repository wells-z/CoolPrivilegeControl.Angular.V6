import { TestBed, inject } from '@angular/core/testing';

import { LoadingDialogService } from './loading-dialog.service';

describe('LoadingDialogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingDialogService]
    });
  });

  it('should be created', inject([LoadingDialogService], (service: LoadingDialogService) => {
    expect(service).toBeTruthy();
  }));
});
