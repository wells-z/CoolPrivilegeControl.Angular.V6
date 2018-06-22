import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';

//Components
import { CoolComponent } from "../../../components/common/cool-component";

//Models
import { LuserVm } from "../../../models/luser-vm";
import { SelectedFuncDetail } from "../../../models/RelativeVM/selected-func-detail";
import { SelectedRole } from "../../../models/RelativeVM/selected-role";
import { SelectedLuserOrg } from "../../../models/RelativeVM/selected-luser-org";

import { SelectedSpecificFunc } from "../../../models/uivm/selected-specific-func";
import { SelectedSpecificFuncType } from "../../../models/uivm/selected-specific-func-type";

//Services
import { RoutingHistoryService } from "../../../services/routing-history.service";
import { LoginService } from "../../../services/login.service";
import { LoadingDialogService } from '../../../services/loading-dialog.service';
import { MsgDialogService } from '../../../services/msg-dialog.service';
import { PrivilegeService } from "../../../services/privilege.service";
import { PrivilegeCheckService } from "../../../services/privilege-check.service";

import { LuserMgtService } from '../../../services/luser-mgt.service';


@Component({
  selector: 'app-create-luser',
  templateUrl: './create-luser.component.html',
  styleUrls: ['./create-luser.component.css']
})
export class CreateLuserComponent extends CoolComponent implements OnInit {

  //#region [ Properties ]
  LUserVMInst: LuserVm = new LuserVm();

  isLinear = true;

  LUserStatusLabel: string;

  LUserInfoGroup: FormGroup;
  LUserDetailGroup: FormGroup;

  //#region [ Specific Function List ]
  //#region [ Display ]
  SelFuncDInfos: SelectedSpecificFunc[];
  //#endregion

  selFuncDetailList: SelectedFuncDetail[];
  //#endregion

  //#region [ Specific Role List ]
  selRoleList: SelectedRole[];
  //#endregion

  //#region [ LUser Org List ]
  selLUserOrgList: SelectedLuserOrg[];
  //#endregion

  //#endregion

  //#region [ Constructor ]
  constructor(private route: ActivatedRoute, protected router: Router, private luserSer: LuserMgtService, public loadingDialogSer: LoadingDialogService, protected msgDialogService: MsgDialogService, protected loginSer: LoginService, public routingHistorySer: RoutingHistoryService, protected pirvilegeCheckSer: PrivilegeCheckService, protected privilegeComponentSer: PrivilegeService) {
    super(loginSer, msgDialogService, pirvilegeCheckSer, privilegeComponentSer, router);

    this.FuncKey = "LUserMgt";
    this.FuncListKey = "LUserList";

    this.LUserInfoGroup = new FormGroup({
      LoginNameTextBox: new FormControl({ value: '' }, Validators.required),
      PWDTextBox: new FormControl({ value: '' }, Validators.required),
      StatusRB: new FormControl({ value: 1, disabled: false }, Validators.required),
      AccessPrivilegeTypeRadioBtn: new FormControl({ value: 1 }, Validators.required),
    });

    this.LUserDetailGroup = new FormGroup({
    });
  }
  //#endregion

  //#region [ Event -- Status RadioButton Event ]
  OnChangeStatus(event: any) {
    this.LUserVMInst.Status = this.LUserInfoGroup.get('StatusRB').value;
    if (this.LUserVMInst.Status == 1) {
      this.LUserStatusLabel = this.LangPack.hasOwnProperty('Active') ? this.LangPack['Active'] : 'Active';
    }
    else if (this.LUserVMInst.Status == 2) {
      this.LUserStatusLabel = this.LangPack.hasOwnProperty('InActive') ? this.LangPack['InActive'] : 'InActive';
    }
  }
  //#endregion

  //#region [ Initial Method ]
  ngOnInit() {
    this.LUserVMInst.Status = 1;
    this.OnChangeStatus(null);
    this.LUserVMInst.AccessPrivilegeTypeShort = 1;
    this.LUserInfoGroup.get('AccessPrivilegeTypeRadioBtn').setValue("1");
    this.LUserInfoGroup.get('LoginNameTextBox').setValue("");
    this.LUserInfoGroup.get('PWDTextBox').setValue("");

    this.initOtherFuncs();

    this.selFuncDetailList = [];

    this.msgDialogService.onClosedEvent.subscribe((optResp => {
      if (optResp != null && optResp.ResponseStatus != null && optResp.ResponseStatus.ErrorCode == "00") {
        this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey]);
      }
    }));
  }
  //#endregion

  //#region [ Event -- Reset ]
  OnReset() {
    if (this.selFuncDetailList != null) {
      this.LUserInfoGroup.get('AccessPrivilegeTypeRadioBtn').setValue("1");
      this.LUserVMInst.AccessPrivilegeTypeShort = 1;
    }

    if (this.selRoleList != null) {
      this.LUserInfoGroup.get('AccessPrivilegeTypeRadioBtn').setValue("2");
      this.LUserVMInst.AccessPrivilegeTypeShort = 2;
    }

    if (this.selLUserOrgList != null) {
      this.LUserInfoGroup.get('AccessPrivilegeTypeRadioBtn').setValue("3");
      this.LUserVMInst.AccessPrivilegeTypeShort = 3;
    }

    this.selFuncDetailList = [];
    this.selRoleList = [];
    this.selLUserOrgList = [];

    if (this.LUserVMInst != null) {
      this.LUserVMInst.SelectedRoleList = null;
      this.LUserVMInst.SelectedFuncDetailList = null;
      this.LUserVMInst.SelectedLUserOrgList = null;
    }
  }
  //#endregion

  //#region [ Event -- Login Name ]
  OnChangeLoginName() {
    this.LUserVMInst.LoginName = this.LUserInfoGroup.get('LoginNameTextBox').value;
    // console.log(this.OrgDetailVMInst.OrgDKey);
  }
  //#endregion

  //#region [ Event -- Password ]
  OnChangePWD() {
    this.LUserVMInst.Password = this.LUserInfoGroup.get('PWDTextBox').value;
    // console.log(this.OrgDetailVMInst.OrgDKey);
  }
  //#endregion

  //#region [ Event -- Privilege Type ]
  OnChangeAccPrivilegeType() {
    this.LUserVMInst.AccessPrivilegeTypeShort = this.LUserInfoGroup.get('AccessPrivilegeTypeRadioBtn').value;

    if (this.LUserVMInst.AccessPrivilegeTypeShort == 1) {
      this.selRoleList = [];
      this.selLUserOrgList = [];
      if (this.LUserVMInst != null) {
        this.LUserVMInst.SelectedRoleList = null;
        this.LUserVMInst.SelectedLUserOrgList = null;
      }
    }
    else if (this.LUserVMInst.AccessPrivilegeTypeShort == 2) {
      this.selFuncDetailList = [];
      this.selLUserOrgList = [];
      if (this.LUserVMInst != null) {
        this.LUserVMInst.SelectedFuncDetailList = null;
        this.LUserVMInst.SelectedLUserOrgList = null;
      }
    }
    else if (this.LUserVMInst.AccessPrivilegeTypeShort == 3) {
      this.selFuncDetailList = [];
      this.selRoleList = [];
      if (this.LUserVMInst != null) {
        this.LUserVMInst.SelectedRoleList = null;
        this.LUserVMInst.SelectedFuncDetailList = null;
      }
    }
    // console.log(this.OrgDetailVMInst.AccessPrivilegeTypeShort);
  }
  //#endregion

  //#region [ Callback Event -- selected-LUserOrgs ]
  OnUpdateLUserOrgList(selectLUserOrgList: SelectedLuserOrg[]) {
    this.selLUserOrgList = selectLUserOrgList;
    this.LUserVMInst.SelectedLUserOrgList = selectLUserOrgList;
  }
  //#endregion

  //#region [ Callback Event -- selected-roles ]
  OnUpdateRoleList(selectRoleList: SelectedRole[]) {
    this.selRoleList = selectRoleList;
    this.LUserVMInst.SelectedRoleList = selectRoleList;
  }
  //#endregion

  //#region [ Callback Event -- selected-funcs ]
  OnUpdateFuncDetailList(selectedFuncDetailList: SelectedFuncDetail[]) {
    this.selFuncDetailList = selectedFuncDetailList;
    this.LUserVMInst.SelectedFuncDetailList = this.selFuncDetailList;

    //#region [ Get selected function detail list ]
    if (this.LUserVMInst.SelectedFuncDetailList != null && this.LUserVMInst.SelectedFuncDetailList.length > 0) {
      this.SelFuncDInfos = [];

      let funcIDList: string[] = []
      for (let selFuncDetail of this.LUserVMInst.SelectedFuncDetailList) {
        if (funcIDList.indexOf(selFuncDetail.FuncID) < 0) {
          funcIDList.push(selFuncDetail.FuncID);
        }
      }

      for (let funcID of funcIDList) {
        let selSpecificFuncDetailList = this.LUserVMInst.SelectedFuncDetailList.filter(selFunc => selFunc.FuncID == funcID);

        if (selSpecificFuncDetailList != null && selSpecificFuncDetailList.length > 0) {
          let selSpecificFunc_new = new SelectedSpecificFunc();
          selSpecificFunc_new.FuncName = this.LangPack.hasOwnProperty(selSpecificFuncDetailList[0].FuncKey) ? this.LangPack[selSpecificFuncDetailList[0].FuncKey] : selSpecificFuncDetailList[0].FuncKey;
          selSpecificFunc_new.FuncTypeList = [];
          for (let selSpecificFuncDetail of selSpecificFuncDetailList) {
            let selSpecificFuncType = new SelectedSpecificFuncType();
            selSpecificFuncType.FuncTypeKey = selSpecificFuncDetail.FuncTypeKey;
            selSpecificFunc_new.FuncTypeList.push(selSpecificFuncType);
          }
          this.SelFuncDInfos.push(selSpecificFunc_new);
        }
      }
    }
    //#endregion
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
    this.luserSer.createLUser(this.LUserVMInst).subscribe(
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
