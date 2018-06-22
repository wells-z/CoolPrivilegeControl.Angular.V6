import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';

//Components
import { CoolComponent } from "../../../components/common/cool-component";

//Models
import { RoleVm } from "../../../models/role-vm";
import { OperationResponse } from '../../../models/common/operation-response';
import { ResponseStatus } from '../../../models/common/response-status';
import { SelectedFuncDetail } from "../../../models/relativevm/selected-func-detail";

import { SelectedSpecificFunc } from "../../../models/uivm/selected-specific-func";
import { SelectedSpecificFuncType } from "../../../models/uivm/selected-specific-func-type";

//Services
import { RoutingHistoryService } from "../../../services/routing-history.service";
import { LoginService } from "../../../services/login.service";
import { LoadingDialogService } from '../../../services/loading-dialog.service';
import { MsgDialogService } from '../../../services/msg-dialog.service';
import { PrivilegeService } from "../../../services/privilege.service";
import { PrivilegeCheckService } from "../../../services/privilege-check.service";

import { RoleMgtService } from "../../../services/role-mgt.service";

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.css']
})
export class EditRoleComponent extends CoolComponent implements OnInit {

  //#region [ Properties ]
  RoleVMInst: RoleVm = new RoleVm();

  SelFuncDInfos: SelectedSpecificFunc[];

  selFuncDetailList: SelectedFuncDetail[];

  roleId: string;
  //#endregion

  //#region [ Constructor ]
  constructor(private route: ActivatedRoute, protected router: Router, private roleSer: RoleMgtService, public loadingDialogSer: LoadingDialogService, protected msgDialogService: MsgDialogService, protected loginSer: LoginService, public routingHistorySer: RoutingHistoryService, protected pirvilegeCheckSer: PrivilegeCheckService, protected privilegeComponentSer: PrivilegeService) {
    super(loginSer, msgDialogService, pirvilegeCheckSer, privilegeComponentSer, router);

    this.FuncKey = "RoleMgt";
    this.FuncListKey = "RoleList";
  }
  //#endregion

  //#region [ Initial Method ]
  ngOnInit() {
    this.loadingDialogSer.OpenLoadingDialog();

    this.initOtherFuncs();

    this.selFuncDetailList = [];

    this.msgDialogService.onClosedEvent.subscribe((optResp => {
      if (optResp != null && optResp.ResponseStatus != null && optResp.ResponseStatus.ErrorCode == "00") {
        this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey]);
      }
    }));

    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has("ID")) {
        this.roleId = params.get("ID");

        this.roleSer.getRoleByRoleId(this.LangKey, this.roleId).subscribe(
          resp => {
            if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
              if (resp.Inst != null) {
                this.RoleVMInst = resp.Inst;

                this.selFuncDetailList = this.RoleVMInst.SelectedFuncDetailList;
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

  //#region [ Callback Event -- selected-funcs ]
  OnUpdateFuncDetailList(selectedFuncDetailList: SelectedFuncDetail[]) {
    this.selFuncDetailList = selectedFuncDetailList;
    this.RoleVMInst.SelectedFuncDetailList = this.selFuncDetailList;

    //#region [ Get selected function detail list ]
    if (this.RoleVMInst.SelectedFuncDetailList != null && this.RoleVMInst.SelectedFuncDetailList.length > 0) {
      this.SelFuncDInfos = [];

      let funcIDList: string[] = []
      for (let selFuncDetail of this.RoleVMInst.SelectedFuncDetailList) {
        if (funcIDList.indexOf(selFuncDetail.FuncID) < 0) {
          funcIDList.push(selFuncDetail.FuncID);
        }
      }

      for (let funcID of funcIDList) {
        let selSpecificFuncDetailList = this.RoleVMInst.SelectedFuncDetailList.filter(selFunc => selFunc.FuncID == funcID);

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

    if (this.selFuncDetailList == null || this.selFuncDetailList.length == 0) {
      let responseStatus = new ResponseStatus();
      responseStatus.ErrorCode = "01";

      let strMsg = "Please select at least one function."
      if (this.LangPack.hasOwnProperty("E031") && this.LangPack.hasOwnProperty("Function")) {
        //Please select at least one {0}
        strMsg = this.LangPack["E031"].replace("{0}", this.LangPack["Function"]);
      }

      responseStatus.Message = strMsg;
      let optResp = new OperationResponse(null, '', responseStatus);

      this.msgDialogService.OpenDialog(optResp);
      return null;
    }

    this.loadingDialogSer.OpenLoadingDialog();
    this.roleSer.editRole(this.RoleVMInst).subscribe(
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
