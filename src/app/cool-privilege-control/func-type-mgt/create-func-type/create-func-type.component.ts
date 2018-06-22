import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

//Components
import { CoolComponent } from "../../components/common/cool-component";

//Models
import { FuncTypeVm } from "../../models/func-type-vm";

//Services
import { FuncTypeMgtService } from "../../services/func-type-mgt.service";
import { RoutingHistoryService } from "../../services/routing-history.service";
import { LoginService } from "../../services/login.service";
import { LoadingDialogService } from '../../services/loading-dialog.service';
import { MsgDialogService } from '../../services/msg-dialog.service';
import { PrivilegeService } from "../../services/privilege.service";
import { PrivilegeCheckService } from "../../services/privilege-check.service";

@Component({
  selector: 'app-create-func-type',
  templateUrl: './create-func-type.component.html',
  styleUrls: ['./create-func-type.component.css']
})
export class CreateFuncTypeComponent extends CoolComponent implements OnInit {
  FuncTypeVMInst: FuncTypeVm = new FuncTypeVm();

  FuncTypeStatusLabel: string;

  FuncTypeDetailGroup: FormGroup;

  isLinear = true;

  constructor(private _formBuilder: FormBuilder, protected route: ActivatedRoute, protected router: Router, private funcTypeSer: FuncTypeMgtService, private loadingDialogSer: LoadingDialogService, protected msgDialogService: MsgDialogService, protected loginSer: LoginService, protected privilegeComponentSer: PrivilegeService, protected pirvilegeCheckSer: PrivilegeCheckService, private routingHistorySer: RoutingHistoryService) {
    super(loginSer, msgDialogService, pirvilegeCheckSer, privilegeComponentSer, router);

    this.FuncKey = "FuncTMgt";
    this.FuncListKey = "FuncTypeList";
    
    this.FuncTypeDetailGroup = new FormGroup({
      FuncTypeKey: new FormControl({ value: '', disabled: false }, Validators.required),
      Priority: new FormControl({ value: null, disabled: false }, Validators.required),
      StatusRB: new FormControl({ value: 1, disabled: false }, Validators.required)
    });
  }

  //#region [ Evnet -- Func Type Key Change Event ]
  OnChangeFuncTypeKey() {
    this.FuncTypeVMInst.FuncTypeKey = this.FuncTypeDetailGroup.get('FuncTypeKey').value;
  }
  //#endregion

  //#region [ Evnet -- Priority Change Event ]
  OnChangePriority() {
    this.FuncTypeVMInst.Priority = this.FuncTypeDetailGroup.get('Priority').value;
  }
  //#endregion

  //#region [ Event -- Status RadioButton Event ]
  OnChangeStatus(event: any) {
    this.FuncTypeVMInst.Status = this.FuncTypeDetailGroup.get('StatusRB').value;
    if (this.FuncTypeVMInst.Status == 1) {
      this.FuncTypeStatusLabel = this.LangPack.hasOwnProperty('Active') ? this.LangPack['Active'] : 'Active';
    }
    else if (this.FuncTypeVMInst.Status == 2) {
      this.FuncTypeStatusLabel = this.LangPack.hasOwnProperty('InActive') ? this.LangPack['InActive'] : 'InActive';
    }
  }
  //#endregion

  //#region [ Event -- Back To List Button Event ]
  OnBackToList() {
    this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //endregion

  //#region [ Event -- Save Button Event ]
  OnSave() {
    this.loadingDialogSer.OpenLoadingDialog();
    this.funcTypeSer.createFuncType(this.FuncTypeVMInst).subscribe(
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
      }
    );
  }
  //#endregion

  //#region [ Initial Method ]
  ngOnInit() {
    // this.routingHistorySer.loadRouting();

    this.FuncTypeVMInst.Status = 1;

    this.OnChangeStatus(null);

    this.initOtherFuncs();

    this.loadingDialogSer.OpenLoadingDialog();

    //#region [ Language Change CallBack ]
    this.loadingDialogSer.onLangChangeEvent.subscribe(optResp => {
      this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey]);
    });
    //#endregion

    //#region [ Msg Box CallBack ]
    this.msgDialogService.onClosedEvent.subscribe((optResp => {
      if (optResp != null && optResp.ResponseStatus != null && optResp.ResponseStatus.ErrorCode == "00") {
        this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey]);
      }
    }));
    //#endregion

    //#region [ Get max Function Type Priority ]
    this.funcTypeSer.getMaxFuncTypePri(this.LangKey).subscribe(
      resp => {
        if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
          if (resp.Inst) {
            if (resp.Inst.Priority != null) {
              this.FuncTypeVMInst.Priority = resp.Inst.Priority + 1;
            }

            this.loadingDialogSer.refreshAuthKey(resp);
          }
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
}
