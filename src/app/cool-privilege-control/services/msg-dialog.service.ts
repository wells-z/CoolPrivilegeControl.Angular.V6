import { Injectable, Output, EventEmitter } from '@angular/core';

import { OperationResponse } from '../models/common/operation-response';
import { ResponseStatus } from '../models/common/response-status';

@Injectable({
  providedIn: 'root'
})
export class MsgDialogService {

  @Output() onClosedEvent: EventEmitter<OperationResponse> = new EventEmitter();

  @Output() onOpenDialogEvent: EventEmitter<OperationResponse> = new EventEmitter();

  constructor() { }

  ClosedDialog(optResp: OperationResponse) {
    this.onClosedEvent.emit(optResp);
  }

  OpenDialog(optResp: OperationResponse)
  {
    this.onOpenDialogEvent.emit(optResp);
  }

  OpenFailureDialog(err: any) {
    let responseStatus = new ResponseStatus();
    responseStatus.ErrorCode = "01";
    responseStatus.Message = err.message;

    let optResp = new OperationResponse(null, '', responseStatus);

    this.OpenDialog(optResp);
  }
}
