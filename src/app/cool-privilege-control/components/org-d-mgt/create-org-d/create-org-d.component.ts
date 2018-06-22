import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';

//Components
import { CoolComponent } from "../../../components/common/cool-component";

//Models
import { OrgDetailVm } from "../../../models/org-detail-vm";
import { SelectedFuncDetail } from "../../../models/relativevm/selected-func-detail";
import { SelectedOrgDetailAccRole } from "../../../models/relativevm/selected-org-detail-acc-role";

import { SelectedSpecificFunc } from "../../../models/uivm/selected-specific-func";
import { SelectedSpecificFuncType } from "../../../models/uivm/selected-specific-func-type";

//Services
import { RoutingHistoryService } from "../../../services/routing-history.service";
import { LoginService } from "../../../services/login.service";
import { LoadingDialogService } from '../../../services/loading-dialog.service';
import { MsgDialogService } from '../../../services/msg-dialog.service';
import { PrivilegeService } from "../../../services/privilege.service";
import { PrivilegeCheckService } from "../../../services/privilege-check.service";

import { OrgDmgtService } from "../../../services/org-dmgt.service";

@Component({
  selector: 'app-create-org-d',
  templateUrl: './create-org-d.component.html',
  styleUrls: ['./create-org-d.component.css']
})
export class CreateOrgDComponent extends CoolComponent implements OnInit {

  //#region [ Properties ]
  OrgDetailVMInst: OrgDetailVm = new OrgDetailVm();

  isLinear = true;

  OrgDInfoGroup: FormGroup;
  OrgDDetailGroup: FormGroup;

  //#region [ Specific Function List ]
  //#region [ Display ]
  SelFuncDInfos: SelectedSpecificFunc[];
  //#endregion

  selFuncDetailList: SelectedFuncDetail[];
  //#endregion

  //#region [ Specific Role List ]
  selRoleList: SelectedOrgDetailAccRole[];
  //#endregion
  //#endregion

  //#region [ Constructor ]
  constructor(private route: ActivatedRoute, protected router: Router, private orgDSer: OrgDmgtService, public loadingDialogSer: LoadingDialogService, protected msgDialogService: MsgDialogService, protected loginSer: LoginService, public routingHistorySer: RoutingHistoryService, protected pirvilegeCheckSer: PrivilegeCheckService, protected privilegeComponentSer: PrivilegeService) {
    super(loginSer, msgDialogService, pirvilegeCheckSer, privilegeComponentSer, router);

    this.FuncKey = "OrgDMgt";
    this.FuncListKey = "OrgDList";

    this.OrgDInfoGroup = new FormGroup({
      OrgDKeyTextBox: new FormControl({ value: '' }, Validators.required),
      AccessPrivilegeTypeRadioBtn: new FormControl({ value: 1 }, Validators.required),
    });

    this.OrgDDetailGroup = new FormGroup({
    });
  }
  //#endregion

  //#region [ Initial Method ]
  ngOnInit() {
    this.OrgDetailVMInst.AccessPrivilegeTypeShort = 1;
    this.OrgDInfoGroup.get('AccessPrivilegeTypeRadioBtn').setValue("1");
    this.OrgDInfoGroup.get('OrgDKeyTextBox').setValue("");

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
    if (this.selRoleList != null) {
      this.OrgDInfoGroup.get('AccessPrivilegeTypeRadioBtn').setValue("2");
      this.OrgDetailVMInst.AccessPrivilegeTypeShort = 2;
    }

    if (this.selFuncDetailList != null) {
      this.OrgDInfoGroup.get('AccessPrivilegeTypeRadioBtn').setValue("1");
      this.OrgDetailVMInst.AccessPrivilegeTypeShort = 1;
    }

    this.selRoleList = [];
    this.selFuncDetailList = [];

    if (this.OrgDetailVMInst != null) {
      this.OrgDetailVMInst.SelectedOrgDetailAccRoleList = [];
      this.OrgDetailVMInst.SelectedFuncDetailList = [];
    }
  }
  //#endregion

  //#region [ Event -- Org Detail Key ]
  OnChangeOrgDKey() {
    this.OrgDetailVMInst.OrgDKey = this.OrgDInfoGroup.get('OrgDKeyTextBox').value;
    // console.log(this.OrgDetailVMInst.OrgDKey);
  }
  //#endregion

  //#region [ Event -- Privilege Type ]
  OnChangeAccPrivilegeType() {
    this.OrgDetailVMInst.AccessPrivilegeTypeShort = this.OrgDInfoGroup.get('AccessPrivilegeTypeRadioBtn').value;

    if (this.OrgDetailVMInst.AccessPrivilegeTypeShort == 1) {
      this.selRoleList = [];
      if (this.OrgDetailVMInst != null)
        this.OrgDetailVMInst.SelectedOrgDetailAccRoleList = null;
    }
    else if (this.OrgDetailVMInst.AccessPrivilegeTypeShort == 2) {
      this.selFuncDetailList = [];
      if (this.OrgDetailVMInst != null)
        this.OrgDetailVMInst.SelectedFuncDetailList = null;
    }
    // console.log(this.OrgDetailVMInst.AccessPrivilegeTypeShort);
  }
  //#endregion

  //#region [ Callback Event -- selected-roles ]
  OnUpdateRoleList(selectedOrgDAccRoleList: SelectedOrgDetailAccRole[]) {
    this.selRoleList = selectedOrgDAccRoleList;
    this.OrgDetailVMInst.SelectedOrgDetailAccRoleList = selectedOrgDAccRoleList;
  }
  //#endregion

  //#region [ Callback Event -- selected-funcs ]
  OnUpdateFuncDetailList(selectedFuncDetailList: SelectedFuncDetail[]) {
    this.selFuncDetailList = selectedFuncDetailList;
    this.OrgDetailVMInst.SelectedFuncDetailList = this.selFuncDetailList;

    //#region [ Get selected function detail list ]
    if (this.OrgDetailVMInst.SelectedFuncDetailList != null && this.OrgDetailVMInst.SelectedFuncDetailList.length > 0) {
      this.SelFuncDInfos = [];

      let funcIDList: string[] = []
      for (let selFuncDetail of this.OrgDetailVMInst.SelectedFuncDetailList) {
        if (funcIDList.indexOf(selFuncDetail.FuncID) < 0) {
          funcIDList.push(selFuncDetail.FuncID);
        }
      }

      for (let funcID of funcIDList) {
        let selSpecificFuncDetailList = this.OrgDetailVMInst.SelectedFuncDetailList.filter(selFunc => selFunc.FuncID == funcID);

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
    this.orgDSer.createOrgD(this.OrgDetailVMInst).subscribe(
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