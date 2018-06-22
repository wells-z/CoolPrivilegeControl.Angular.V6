import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';

//Components
import { CoolComponent } from "../../../components/common/cool-component";

//Models
import { FuncTypeVm } from "../../../models/func-type-vm";

//Services
import { RoutingHistoryService } from "../../../services/routing-history.service";
import { LoginService } from "../../../services/login.service";
import { LoadingDialogService } from '../../../services/loading-dialog.service';
import { MsgDialogService } from '../../../services/msg-dialog.service';
import { PrivilegeService } from "../../../services/privilege.service";
import { PrivilegeCheckService } from "../../../services/privilege-check.service";

import { FuncTypeMgtService } from "../../../services/func-type-mgt.service";

@Component({
  selector: 'app-edit-func-type',
  templateUrl: './edit-func-type.component.html',
  styleUrls: ['./edit-func-type.component.css']
})
export class EditFuncTypeComponent extends CoolComponent implements OnInit {
  funcTypeId: string;

  FuncTypeVMInst: FuncTypeVm = new FuncTypeVm();

  constructor(private route: ActivatedRoute, protected router: Router, private funcTypeSer: FuncTypeMgtService, private loadingDialogSer: LoadingDialogService, protected msgDialogService: MsgDialogService, protected loginSer: LoginService, private routingHistorySer: RoutingHistoryService, protected privilegeComponentSer: PrivilegeService, protected pirvilegeCheckSer: PrivilegeCheckService) {
    super(loginSer, msgDialogService, pirvilegeCheckSer, privilegeComponentSer, router);

    this.FuncKey = "FuncTMgt";
    this.FuncListKey = "FuncTypeList";
  }

  //#region [ Event -- Return Button Event ]
  OnBackToList() {
    this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  //#region [ Event -- Save Button Event ]
  OnSave() {
    this.loadingDialogSer.OpenLoadingDialog();

    this.funcTypeSer.editFuncType(this.FuncTypeVMInst).subscribe(
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

    this.initOtherFuncs();

    this.loadingDialogSer.OpenLoadingDialog();

    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has("ID")) {
        this.funcTypeId = params.get("ID");

        this.funcTypeSer.getFuncTypeByFuncTypeId(this.LangKey, this.funcTypeId).subscribe(
          resp => {
            if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
              if (resp.Inst != null) {
                this.FuncTypeVMInst = resp.Inst;
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
