import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';

//Components
import { CoolComponent } from "../../../components/common/cool-component";

//Models
import { RoleVm } from "../../../models/role-vm";
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
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.css']
})
export class CreateRoleComponent extends CoolComponent implements OnInit {

  //#region [ Properties ]
  RoleVMInst: RoleVm = new RoleVm();

  isLinear = true;

  RoleInfoGroup: FormGroup;
  RoleDetailGroup: FormGroup;

  SelFuncDInfos: SelectedSpecificFunc[];

  //#endregion

  selFuncDetailList: SelectedFuncDetail[]

  //#region [ Constructor ]
  constructor(private route: ActivatedRoute, protected router: Router, private roleSer: RoleMgtService, public loadingDialogSer: LoadingDialogService, protected msgDialogService: MsgDialogService, protected loginSer: LoginService, public routingHistorySer: RoutingHistoryService, protected pirvilegeCheckSer: PrivilegeCheckService, protected privilegeComponentSer: PrivilegeService) {
    super(loginSer, msgDialogService, pirvilegeCheckSer, privilegeComponentSer, router);

    this.FuncKey = "RoleMgt";
    this.FuncListKey = "RoleList";

    this.RoleVMInst.RoleKey = "";
    this.RoleInfoGroup = new FormGroup({
      RoleKeyTextBox: new FormControl({ value: '', disabled: false }, Validators.required),
    });

    this.RoleDetailGroup = new FormGroup({
    });
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
  }
  //#endregion

  //#region [ Event -- Reset ]
  OnReset() {
    this.selFuncDetailList = [];

    if (this.RoleVMInst != null) {
      this.RoleVMInst.SelectedFuncDetailList = [];
    }
  }
  //#endregion

  //#region [ Event -- Role Key Change Event ]
  OnChangeRoleKey() {
    this.RoleVMInst.RoleKey = this.RoleInfoGroup.get("RoleKeyTextBox").value;
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
    if (this.AuthKey != null && this.AuthKey != "") {
      this.loadingDialogSer.OpenLoadingDialog();
      this.roleSer.createRole(this.RoleVMInst).subscribe(
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
