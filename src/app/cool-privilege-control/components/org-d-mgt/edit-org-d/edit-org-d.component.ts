import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';

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
  selector: 'app-edit-org-d',
  templateUrl: './edit-org-d.component.html',
  styleUrls: ['./edit-org-d.component.css']
})
export class EditOrgDComponent extends CoolComponent implements OnInit {

  //#region [ Properties ]
  OrgDetailVMInst: OrgDetailVm = new OrgDetailVm();

  orgDId: string;

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
  }
  //#endregion

  //#region [ Initial Method ]
  ngOnInit() {

    this.initOtherFuncs();

    this.selFuncDetailList = [];

    this.msgDialogService.onClosedEvent.subscribe((optResp => {
      if (optResp != null && optResp.ResponseStatus != null && optResp.ResponseStatus.ErrorCode == "00") {
        this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey]);
      }
    }));


    if (this.AuthKey != null && this.AuthKey != "") {

      this.loadingDialogSer.OpenLoadingDialog();

      this.route.paramMap.subscribe((params: ParamMap) => {
        if (params.has("ID")) {
          this.orgDId = params.get("ID");

          this.orgDSer.getOrgDByOrgDId(this.LangKey, this.orgDId).subscribe(
            resp => {
              if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
                if (resp.Inst != null) {
                  this.OrgDetailVMInst = resp.Inst;

                  if (this.OrgDetailVMInst.AccessPrivilegeTypeShort == 1) {
                    this.selFuncDetailList = this.OrgDetailVMInst.SelectedFuncDetailList;
                  }
                  else if (this.OrgDetailVMInst.AccessPrivilegeTypeShort == 2) {
                    this.selRoleList = this.OrgDetailVMInst.SelectedOrgDetailAccRoleList;
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
        }
        else {
          this.msgDialogService.OpenFailureDialog({ message: this.LangPack.E003 });
          this.loadingDialogSer.CloseLoadingDialog();
        }
      }
      );
    }
  }
  //#endregion

  //#region [ Event -- Org Detail Key ]
  OnChangeOrgDKey() {
    // console.log(this.OrgDetailVMInst.OrgDKey);
  }
  //#endregion

  //#region [ Event -- Privilege Type ]
  OnChangeAccPrivilegeType() {
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
    if (this.AuthKey != null && this.AuthKey != "") {
      this.loadingDialogSer.OpenLoadingDialog();
      this.orgDSer.editOrgD(this.OrgDetailVMInst).subscribe(
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
  }
  //#endregion
}
