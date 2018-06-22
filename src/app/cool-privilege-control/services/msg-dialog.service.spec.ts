import { TestBed, inject } from '@angular/core/testing';

import { MsgDialogService } from './msg-dialog.service';

describe('MsgDialogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MsgDialogService]
    });
  });

  it('should be created', inject([MsgDialogService], (service: MsgDialogService) => {
    expect(service).toBeTruthy();
  }));
});
