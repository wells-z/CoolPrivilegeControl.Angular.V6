import { Component, OnInit } from '@angular/core';
// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { DomSanitizer } from '@angular/platform-browser';

// import { LocalStorage, SessionStorage } from 'ngx-webstorage';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
// import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
// import { FlexLayoutModule } from "@angular/flex-layout";

//Components
import { CoolComponent } from "../../../components/common/cool-component";

//Models
// import { Error } from '../../models/common/error';
// import { OperationResponse } from '../../models/common/operation-response';
// import { ResponseStatus } from '../../models/common/response-status';
// import { SearchableVm } from "../../models/searchable-vm";
import { FuncVm } from "../../../models/func-vm";
import { FuncTypeVm } from "../../../models/func-type-vm";
import { SelectedFuncType } from "../../../models/relativevm/selected-func-type";
// import { PrivilegeTypeVm } from "../../models/privilege-type-vm";

//Services
import { FuncMgtService } from "../../../services/func-mgt.service";
import { FuncTypeMgtService } from "../../../services/func-type-mgt.service";
import { RoutingHistoryService } from "../../../services/routing-history.service";
import { LoginService } from "../../../services/login.service";
import { LoadingDialogService } from '../../../services/loading-dialog.service';
import { MsgDialogService } from '../../../services/msg-dialog.service';
import { PrivilegeService } from "../../../services/privilege.service";
import { PrivilegeCheckService } from "../../../services/privilege-check.service";

@Component({
  selector: 'app-edit-func',
  templateUrl: './edit-func.component.html',
  styleUrls: ['./edit-func.component.css']
})
export class EditFuncComponent extends CoolComponent implements OnInit {
  funcId: string;

  FuncVMInst: FuncVm = new FuncVm();

  constructor(private route: ActivatedRoute, protected router: Router, public funcSer: FuncMgtService, public funcTypeSer: FuncTypeMgtService, public loadingDialogSer: LoadingDialogService, public msgDialogService: MsgDialogService, public loginSer: LoginService, public routingHistorySer: RoutingHistoryService, public privilegeComponentSer: PrivilegeService, public pirvilegeCheckSer: PrivilegeCheckService) {
    super(loginSer, msgDialogService, pirvilegeCheckSer, privilegeComponentSer, router);

    this.FuncKey = "FuncMgt";
    this.FuncListKey = "FuncList";
  }

  //#region [ Event -- Function Type Checkbox Event ]
  OnCheckFuncType(event: any, funcType: FuncTypeVm) {
    let isContains = false;
    let index = -1;

    if (this.FuncVMInst.SelectedFucTypeList != null) {
      for (let selectedFuncTypeVM of this.FuncVMInst.SelectedFucTypeList) {
        if (selectedFuncTypeVM.FuncTypeID == funcType.ID) {
          isContains = true;
          index = this.FuncVMInst.SelectedFucTypeList.indexOf(selectedFuncTypeVM);
        }
        else {
          isContains = false;
        }
      }
    }
    else {
      this.FuncVMInst.SelectedFucTypeList = [];
    }

    if (isContains) {
      this.FuncVMInst.SelectedFucTypeList.splice(index, 1);
    }
    else {
      let selectedFuncType = new SelectedFuncType();
      selectedFuncType.FuncTypeID = funcType.ID;
      selectedFuncType.FuncTypeKey = funcType.FuncTypeKey;
      selectedFuncType.Selected = true;
      this.FuncVMInst.SelectedFucTypeList.push(selectedFuncType)
    }
  }
  //#endregion

  //#region [ Event -- Back To List Button Event ]
  OnBackToList() {
    this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  //#region [ Event -- Save Button Event ]
  OnSave() {
    if (this.AuthKey != null && this.AuthKey != "") {
      this.loadingDialogSer.OpenLoadingDialog();

      this.funcSer.editFunc(this.FuncVMInst).subscribe(
        resp => {
          if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {

            this.loadingDialogSer.refreshAuthKey(resp);

            resp.ResponseStatus.Message = this.LangPack.hasOwnProperty('I000') ? this.LangPack['I000'] : 'Save Successfully!';

            this.msgDialogService.OpenDialog(resp);
          }
          else if (resp != null) {

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

  //#region [ Initial Method ]
  ngOnInit() {
    // this.routingHistorySer.loadRouting();

    this.initOtherFuncs();

    if (this.AuthKey != null && this.AuthKey != "") {
      this.loadingDialogSer.OpenLoadingDialog();

      this.route.paramMap.subscribe((params: ParamMap) => {
        if (params.has("ID")) {
          this.funcId = params.get("ID");

          this.funcSer.getFuncByFuncId(this.LangKey, this.funcId).subscribe(
            resp => {
              if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
                if (resp.Inst != null) {
                  this.FuncVMInst = resp.Inst;
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
      });
    }

    //#region [ Msg Box CallBack ]
    this.msgDialogService.onClosedEvent.subscribe((optResp => {
      if (optResp != null && optResp.ResponseStatus != null && optResp.ResponseStatus.ErrorCode == "00") {
        this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey]);
      }
    }));
    //#endregion
  }
  //#endregion
}
