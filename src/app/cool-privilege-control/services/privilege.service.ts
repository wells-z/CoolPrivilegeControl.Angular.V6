import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { PrivilegeTypeVm } from '../models/privilege-type-vm';

@Injectable({
  providedIn: 'root'
})
export class PrivilegeService {

  @Output() onSetPrivilegeEvent: EventEmitter<PrivilegeTypeVm> = new EventEmitter();

  // @Output() onGetPrivilegeEvent: EventEmitter<void> = new EventEmitter();

  @Output() onGetPrivilegeCallBackEvent: EventEmitter<PrivilegeTypeVm> = new EventEmitter();

  private privilegeTypeVMInst: PrivilegeTypeVm

  constructor() { }

  SetPrivilegeValue(privilegeTypeVMInst: PrivilegeTypeVm) {
    this.onSetPrivilegeEvent.emit(privilegeTypeVMInst);
  }

  // GetPrivilegeValue() {
  //   this.onGetPrivilegeEvent.emit();
  // }

  GetPrivlegeCallBack(privilegeTypeVMInst: PrivilegeTypeVm) {
    this.onGetPrivilegeCallBackEvent.emit(privilegeTypeVMInst);
  }
}
