import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';

//Components
import { CoolComponent } from "../../../components/common/cool-component";

//Models
import { OrgVm } from "../../../models/org-vm";

//Services
import { RoutingHistoryService } from "../../../services/routing-history.service";
import { LoginService } from "../../../services/login.service";
import { LoadingDialogService } from '../../../services/loading-dialog.service';
import { MsgDialogService } from '../../../services/msg-dialog.service';
import { PrivilegeService } from "../../../services/privilege.service";
import { PrivilegeCheckService } from "../../../services/privilege-check.service";

import { OrgMgtService } from '../../../services/org-mgt.service';

@Component({
  selector: 'app-create-org',
  templateUrl: './create-org.component.html',
  styleUrls: ['./create-org.component.css']
})
export class CreateOrgComponent extends CoolComponent implements OnInit {
  //#region [ Properties ]
  OrgVMInst: OrgVm = new OrgVm();

  isLinear = true;

  OrgVMInsts: any[] = [];

  OrgStatusLabel: string;

  ParentPath: string;

  isNewParentOrg: boolean = false;

  ParentOrgGroup: FormGroup;
  OrgDetailGroup: FormGroup;
  //#endregion

  createRange(number) {
    var items: number[] = [];
    for (var i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }

  //#region [ Constructor ]
  constructor(private route: ActivatedRoute, protected router: Router, private orgSer: OrgMgtService, public loadingDialogSer: LoadingDialogService, protected msgDialogService: MsgDialogService, protected loginSer: LoginService, public routingHistorySer: RoutingHistoryService, protected pirvilegeCheckSer: PrivilegeCheckService, protected privilegeComponentSer: PrivilegeService) {
    super(loginSer, msgDialogService, pirvilegeCheckSer, privilegeComponentSer, router);

    this.FuncKey = "OrgMgt";
    this.FuncListKey = "OrgList";

    this.OrgVMInst.Status = 1;
    this.OrgStatusLabel = this.LangPack.hasOwnProperty('Active') ? this.LangPack['Active'] : 'Active';

    this.ParentOrgGroup = new FormGroup({
      isNewParentOrgCheckBox: new FormControl({ value: false, disabled: false }, Validators.required),
      ParentOrgSelect: new FormControl({ value: '', disabled: false }, Validators.required),
      OrgPathTextBox: new FormControl({ value: '', disabled: true }, Validators.required)
    });

    this.OrgDetailGroup = new FormGroup({
      OrgKey: new FormControl({ value: '', disabled: false }, Validators.required),
      Status: new FormControl({ value: 1, disabled: false }, Validators.required),
    });
  }
  //#endregion

  //#region [ Event -- Change New Parent Organization Event ]
  OnChangeNewParentOrg(event: any) {
    this.isNewParentOrg = this.ParentOrgGroup.get('isNewParentOrgCheckBox').value;
    this.ParentPath = "";

    if (this.isNewParentOrg) {
      this.ParentOrgGroup.controls.ParentOrgSelect.disable();

      this.ParentOrgGroup.get("ParentOrgSelect").setValue("");
      this.ParentPath = "";

      this.ParentOrgGroup.controls.OrgPathTextBox.enable();
    }
    else {
      this.ParentOrgGroup.controls.ParentOrgSelect.enable();

      this.ParentOrgGroup.controls.OrgPathTextBox.disable();

      this.ParentOrgGroup.get("OrgPathTextBox").setValue("");

      this.OrgVMInst.OrgPath = "";
    }
  }
  //#endregion

  //#region [ Initial Method ]
  ngOnInit() {
    this.OrgVMInst.Status = 1;

    this.loadingDialogSer.OpenLoadingDialog();

    this.initOtherFuncs();

    this.msgDialogService.onClosedEvent.subscribe((optResp => {
      if (optResp != null && optResp.ResponseStatus != null && optResp.ResponseStatus.ErrorCode == "00") {
        this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey]);
      }
    }));

    //#region [ Get Parent Function List ]
    this.orgSer.getAvailableOrgList(true, this.LangKey).subscribe(
      resp => {
        if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
          if (resp.Inst != null) {
            for (let item of resp.Inst) {
              let orgVM = new OrgVm();
              orgVM.OrgPath = item.OrgPath;
              orgVM.OrgKey = item.OrgKey;
              orgVM.Status = item.Status;
              orgVM.OrgLevls = item.OrgLevls;
              this.OrgVMInsts.push(orgVM);
            }
          }

          this.loadingDialogSer.refreshAuthKey(resp);
        }
        else if (resp != null) {

          this.msgDialogService.OpenDialog(resp);
        }

        this.loadingDialogSer.CloseLoadingDialog();
      },
      err => {
        this.msgDialogService.OpenFailureDialog(err);
        this.loadingDialogSer.CloseLoadingDialog();
      }
    );
    //#endregion
  }
  //#endregion

  //#region [ Event -- Status RadioButton Event ]
  OnChangeStatus(event: any) {
    this.OrgVMInst.Status = this.OrgDetailGroup.get('Status').value;
    if (this.OrgVMInst.Status == 1) {
      this.OrgStatusLabel = this.LangPack.hasOwnProperty('Active') ? this.LangPack['Active'] : 'Active'
    }
    else if (this.OrgVMInst.Status == 2) {
      this.OrgStatusLabel = this.LangPack.hasOwnProperty('InActive') ? this.LangPack['InActive'] : 'InActive'
    }
  }
  //#endregion

  //#region [ Event -- OrgPath Change Event ]
  OnChangeOrgPath() {
    this.OrgVMInst.OrgPath = this.ParentOrgGroup.get('OrgPathTextBox').value;
  }
  //#endregion

  //#region [ Event -- FuncKey Change Event ]
  OnChangeOrgKey() {
    this.OrgVMInst.OrgKey = this.OrgDetailGroup.get('OrgKey').value;
  }
  //#endregion

  //#region [ Event -- Parent Organization Selector Event ]
  OnParentOrgChange(event: any) {
    this.ParentPath = this.ParentOrgGroup.get('ParentOrgSelect').value;

    this.loadingDialogSer.OpenLoadingDialog();
    this.orgSer.getMaxOrgPath(this.LangKey, this.ParentPath).subscribe(
      resp => {
        if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
          if (resp.Inst != null) {
            this.OrgVMInst.OrgPath = resp.Inst;
            this.ParentOrgGroup.get('OrgPathTextBox').setValue(this.OrgVMInst.OrgPath);
          }

          this.loadingDialogSer.refreshAuthKey(resp);
        }
        else if (resp != null) {

          this.msgDialogService.OpenDialog(resp);
        }

        this.loadingDialogSer.CloseLoadingDialog();
      },
      err => {
        this.msgDialogService.OpenFailureDialog(err);
        this.loadingDialogSer.CloseLoadingDialog();
      }
    );
  }
  //#endregion

  //#region [ Event  -- Back To List ]
  OnBackToList() {
    this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  //#region [ Event -- Save ]
  OnSave() {
    this.loadingDialogSer.OpenLoadingDialog();
    this.orgSer.createOrg(this.OrgVMInst).subscribe(
      resp => {
        if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {

          this.loadingDialogSer.refreshAuthKey(resp);

          resp.ResponseStatus.Message = this.LangPack.hasOwnProperty('I000') ? this.LangPack['I000'] : 'Save Successfully!';

          this.msgDialogService.OpenDialog(resp);
        }
        else if (resp != null) {
          this.loadingDialogSer.refreshAuthKey(resp);

          this.msgDialogService.OpenDialog(resp);
        }

        this.loadingDialogSer.CloseLoadingDialog();
      },
      err => {
        this.msgDialogService.OpenFailureDialog(err);
        this.loadingDialogSer.CloseLoadingDialog();
      });
  }
  //#endregion
}
