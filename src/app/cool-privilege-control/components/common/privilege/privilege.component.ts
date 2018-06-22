import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

//Component
import { PrivilegeTypeVm } from '../../../models/privilege-type-vm';

//Service
import { PrivilegeService } from "../../../services/privilege.service";

@Component({
  selector: 'app-privilege',
  templateUrl: './privilege.component.html',
  styleUrls: ['./privilege.component.css']
})
export class PrivilegeComponent implements OnInit {

  private privilegeTypeVMInst: PrivilegeTypeVm

  constructor(public privilegeSer: PrivilegeService) {
  }

  ngOnInit() {
    this.privilegeSer.onSetPrivilegeEvent.subscribe(privilegeTypeVMInst => {
      this.privilegeTypeVMInst = privilegeTypeVMInst;
      this.privilegeSer.GetPrivlegeCallBack(this.privilegeTypeVMInst);
    });

    // this.privilegeSer.onGetPrivilegeEvent.subscribe(() => {
    //   this.privilegeSer.GetPrivlegeCallBack(this.privilegeTypeVMInst);
    // });
  }
}
