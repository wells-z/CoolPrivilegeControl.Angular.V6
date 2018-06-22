import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Validators, FormControl } from '@angular/forms';

//Components
import { CoolComponent } from "../../../components/common/cool-component";

//Models
import { LuserVm } from "../../../models/luser-vm";
import { SelectedFuncDetail } from "../../../models/RelativeVM/selected-func-detail";
import { SelectedRole } from "../../../models/RelativeVM/selected-role";
import { SelectedLuserOrg } from "../../../models/RelativeVM/selected-luser-org";

import { SysInfoVm } from "../../../models/sys-info-vm";

//Services
import { RoutingHistoryService } from "../../../services/routing-history.service";
import { LoginService } from "../../../services/login.service";
import { LoadingDialogService } from '../../../services/loading-dialog.service';
import { MsgDialogService } from '../../../services/msg-dialog.service';
import { PrivilegeService } from "../../../services/privilege.service";
import { PrivilegeCheckService } from "../../../services/privilege-check.service";

import { LuserMgtService } from '../../../services/luser-mgt.service';

@Component({
  selector: 'app-edit-luser',
  templateUrl: './edit-luser.component.html',
  styleUrls: ['./edit-luser.component.css']
})
export class EditLuserComponent extends CoolComponent implements OnInit {

  //#region [ Properties ]
  LUserVMInst: LuserVm = new LuserVm();

  luserId: string;

  //#region [ Specific Function List ]
  // //#region [ Display ]
  // SelFuncDInfos: SelectedSpecificFunc[];
  // //#endregion

  selFuncDetailList: SelectedFuncDetail[];
  //#endregion

  //#region [ Specific Role List ]
  selRoleList: SelectedRole[];
  //#endregion

  //#region [ LUser Org List ]
  selLUserOrgList: SelectedLuserOrg[];
  //#endregion

  //#reigon [ IsChangePWD ]
  isChangePWD: Boolean = false;
  //#endregion

  PWDFormControl = new FormControl('', [
    Validators.required
  ]);

  SysInfoInst: SysInfoVm;

  strPWDRequired: string;

  strPWDLenChecked: string;

  canChangeAccPrivilegeType: boolean;

  //#endregion

  //#region [ Constructor ]
  constructor(private route: ActivatedRoute, protected router: Router, private luserSer: LuserMgtService, public loadingDialogSer: LoadingDialogService, protected msgDialogService: MsgDialogService, protected loginSer: LoginService, public routingHistorySer: RoutingHistoryService, protected pirvilegeCheckSer: PrivilegeCheckService, protected privilegeComponentSer: PrivilegeService) {
    super(loginSer, msgDialogService, pirvilegeCheckSer, privilegeComponentSer, router);

    this.FuncKey = "LUserMgt";
    this.FuncListKey = "LUserList";
  }
  //#endregion

  //#region [ Initial Method ]
  ngOnInit() {

    this.initOtherFuncs();

    if (this.AuthKey != null && this.AuthKey != "") {
      this.loginSer.getSystemInfo().subscribe(
        resp => {
          if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
            if (resp.Inst != null) {
              this.SysInfoInst = resp.Inst;
              this.PWDFormControl.setValidators([Validators.minLength(this.SysInfoInst.Sys_Password_LengthMin), Validators.maxLength(this.SysInfoInst.Sys_Password_LengthMax), Validators.required]);

              let errorMsg_LenChecked = this.LangPack.hasOwnProperty("E027") ? this.LangPack["E027"] : "E027";
              errorMsg_LenChecked = errorMsg_LenChecked.replace("{0}", this.LangPack["LoginPwd"]);
              errorMsg_LenChecked = errorMsg_LenChecked.replace("{1}", this.SysInfoInst.Sys_Password_LengthMin);
              errorMsg_LenChecked = errorMsg_LenChecked.replace("{2}", this.SysInfoInst.Sys_Password_LengthMax);
              this.strPWDLenChecked = errorMsg_LenChecked;

              let errorMsg_Required = this.LangPack.hasOwnProperty("E001") ? this.LangPack["E001"] : "E001";
              errorMsg_Required = errorMsg_Required.replace("{0}", this.LangPack["LoginPwd"]);
              this.strPWDRequired = errorMsg_Required;
            }
          }
          else if (resp != null) {
            this.msgDialogService.OpenDialog(resp);
          }
        },
        err => {
          this.msgDialogService.OpenFailureDialog(err);
        }
      );
    }

    this.selFuncDetailList = [];

    this.msgDialogService.onClosedEvent.subscribe((optResp => {
      if (optResp != null && optResp.ResponseStatus != null && optResp.ResponseStatus.ErrorCode == "00") {
        this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey]);
      }
    }));

    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has("ID")) {
        this.luserId = params.get("ID");

        this.luserSer.getLUserByLUserId(this.LangKey, this.luserId).subscribe(
          resp => {
            if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
              if (resp.Inst != null) {
                this.LUserVMInst = resp.Inst;

                if (this.LUserVMInst.AccessPrivilegeTypeShort == 1) {
                  this.canChangeAccPrivilegeType = true;
                  this.selFuncDetailList = this.LUserVMInst.SelectedFuncDetailList;
                }
                else if (this.LUserVMInst.AccessPrivilegeTypeShort == 2) {
                  this.canChangeAccPrivilegeType = true;
                  this.selRoleList = this.LUserVMInst.SelectedRoleList;
                }
                else if (this.LUserVMInst.AccessPrivilegeTypeShort == 3) {
                  this.canChangeAccPrivilegeType = false;
                  this.selLUserOrgList = this.LUserVMInst.SelectedLUserOrgList;
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
  //#endregion

  //#region [ Event -- Privilege Type ]
  OnChangeAccPrivilegeType() {
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
  }
  //#endregion

  //#region [ Callback Event -- selected-LUserOrg ]
  OnUpdateLUserOrgList(selectedLUserOrgList: SelectedLuserOrg[]) {
    this.selLUserOrgList = selectedLUserOrgList;
    this.LUserVMInst.SelectedLUserOrgList = selectedLUserOrgList;
  }
  //#endregion

  //#region [ Callback Event -- selected-roles ]
  OnUpdateRoleList(selectedRoleList: SelectedRole[]) {
    this.selRoleList = selectedRoleList;
    this.LUserVMInst.SelectedRoleList = selectedRoleList;
  }
  //#endregion

  //#region [ Callback Event -- selected-funcs ]
  OnUpdateFuncDetailList(selectedFuncDetailList: SelectedFuncDetail[]) {
    this.selFuncDetailList = selectedFuncDetailList;
    this.LUserVMInst.SelectedFuncDetailList = this.selFuncDetailList;

    // //#region [ Get selected function detail list ]
    // if (this.LUserVMInst.SelectedFuncDetailList != null && this.LUserVMInst.SelectedFuncDetailList.length > 0) {
    //   this.SelFuncDInfos = [];

    //   let funcIDList: string[] = []
    //   for (let selFuncDetail of this.LUserVMInst.SelectedFuncDetailList) {
    //     if (funcIDList.indexOf(selFuncDetail.FuncID) < 0) {
    //       funcIDList.push(selFuncDetail.FuncID);
    //     }
    //   }

    //   for (let funcID of funcIDList) {
    //     let selSpecificFuncDetailList = this.LUserVMInst.SelectedFuncDetailList.filter(selFunc => selFunc.FuncID == funcID);

    //     if (selSpecificFuncDetailList != null && selSpecificFuncDetailList.length > 0) {
    //       let selSpecificFunc_new = new SelectedSpecificFunc();
    //       selSpecificFunc_new.FuncName = this.LangPack.hasOwnProperty(selSpecificFuncDetailList[0].FuncKey) ? this.LangPack[selSpecificFuncDetailList[0].FuncKey] : selSpecificFuncDetailList[0].FuncKey;
    //       selSpecificFunc_new.FuncTypeList = [];
    //       for (let selSpecificFuncDetail of selSpecificFuncDetailList) {
    //         let selSpecificFuncType = new SelectedSpecificFuncType();
    //         selSpecificFuncType.FuncTypeKey = selSpecificFuncDetail.FuncTypeKey;
    //         selSpecificFunc_new.FuncTypeList.push(selSpecificFuncType);
    //       }
    //       this.SelFuncDInfos.push(selSpecificFunc_new);
    //     }
    //   }
    // }
    // //#endregion
  }
  //#endregion

  //#region [ Event  -- Back To List ]
  OnBackToList() {
    this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  //#region [ Event -- Change Password ]
  OnChangePWD() {
    this.isChangePWD = true;
  }
  //#endregion

  OnChangePWDTxt() {
    this.LUserVMInst.Password = this.PWDFormControl.value;
  }

  //#region [ Event -- Save ]
  OnSave() {
    this.loadingDialogSer.OpenLoadingDialog();
    this.luserSer.editLUser(this.LUserVMInst).subscribe(
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
