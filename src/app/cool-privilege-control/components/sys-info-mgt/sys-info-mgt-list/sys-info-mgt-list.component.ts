import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';

//Component
import { CoolComponent } from "../../../components/common/cool-component";

//Models
import { Error } from '../../../models/common/error';
import { OperationResponse } from '../../../models/common/operation-response';
import { ResponseStatus } from '../../../models/common/response-status';
import { SysInfoVm } from "../../../models/sys-info-vm";

//Services
import { RoutingHistoryService } from "../../../services/routing-history.service";
import { PrivilegeCheckService } from "../../../services/privilege-check.service";
import { PrivilegeService } from "../../../services/privilege.service";
import { LoginService } from "../../../services/login.service";
import { LoadingDialogService } from '../../../services/loading-dialog.service';
import { MsgDialogService } from '../../../services/msg-dialog.service';

import { SysInfoMgtService } from "../../../services/sys-info-mgt.service";

@Component({
  selector: 'app-sys-info-mgt-list',
  templateUrl: './sys-info-mgt-list.component.html',
  styleUrls: ['./sys-info-mgt-list.component.css']
})
export class SysInfoMgtListComponent extends CoolComponent implements OnInit {

  SysInfoVMInst: SysInfoVm = new SysInfoVm();

  IsValid: boolean = true;

  ErrorMsgs: Error[] = [];

  constructor(private route: ActivatedRoute, protected router: Router, private sysInfoSer: SysInfoMgtService, private loadingDialogSer: LoadingDialogService, protected msgDialogService: MsgDialogService, protected loginSer: LoginService, private routingHistorySer: RoutingHistoryService, protected privilegeComponentSer: PrivilegeService, protected pirvilegeCheckSer: PrivilegeCheckService) {
    super(loginSer, msgDialogService, pirvilegeCheckSer, privilegeComponentSer, router);

    this.FuncKey = "SysInfoMgt";
    this.FuncListKey = "EditSysInfo";
  }

  //#region [ Initial Method ]
  ngOnInit() {
    // this.routingHistorySer.loadRouting();

    this.initOtherFuncs();

    if (this.AuthKey != null && this.AuthKey != "") {
      this.loadingDialogSer.OpenLoadingDialog();
      this.route.paramMap.subscribe((params: ParamMap) => {
        this.sysInfoSer.retrieveSysInfo().subscribe(
          resp => {
            if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
              if (resp.Inst != null) {
                this.SysInfoVMInst = resp.Inst;
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
      )
    };

    //#region [ Msg Box CallBack ]
    this.msgDialogService.onClosedEvent.subscribe((optResp => {
      if (optResp != null && optResp.ResponseStatus != null && optResp.ResponseStatus.ErrorCode == "00") {
        this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey]);
      }
    }));
    //#endregion
  }
  //#endregion

  //#region [ Event -- Change PWD Length Event ]
  OnChangePWDLen() {
    if (this.SysInfoVMInst.Sys_Password_LengthMin == null) {
      this.SysInfoVMInst.Sys_Password_LengthMin = 8;
    }

    if (this.SysInfoVMInst.Sys_Password_LengthMax == null) {
      this.SysInfoVMInst.Sys_Password_LengthMax = 20;
    }

    if (this.SysInfoVMInst.Sys_Password_LengthMin > this.SysInfoVMInst.Sys_Password_LengthMax) {
      let responseStatus = new ResponseStatus();
      responseStatus.ErrorCode = "01";

      //ValidationFailed
      let validationFailedLabel = this.LangPack.hasOwnProperty('ValidationFailed') ? this.LangPack['ValidationFailed'] : 'ValidationFailed';

      let pwdLenMinLabel = this.LangPack.hasOwnProperty('SysInfo_PwdLengthMin') ? this.LangPack['SysInfo_PwdLengthMin'] : 'SysInfo_PwdLengthMin';
      let pwdLenMaxLabel = this.LangPack.hasOwnProperty('SysInfo_PwdLengthMax') ? this.LangPack['SysInfo_PwdLengthMax'] : 'SysInfo_PwdLengthMax';
      let erroMsg = this.LangPack.hasOwnProperty('E041') ? this.LangPack['E041'] : '{0} must be greater than or equal to {1}.';

      erroMsg = erroMsg.replace("{0}", pwdLenMaxLabel);
      erroMsg = erroMsg.replace("{1}", pwdLenMinLabel);

      let errorInst = new Error();
      errorInst.Message = erroMsg;

      let containsMsg = false;
      if (this.ErrorMsgs != null) {
        for (let i = 0; i < this.ErrorMsgs.length; ++i) {
          if (this.ErrorMsgs[i].Message == erroMsg) {
            containsMsg = true;
            break;
          }
        }
      }

      if (!containsMsg) {
        this.ErrorMsgs.push(errorInst);
      }

      responseStatus.Message = validationFailedLabel;
      responseStatus.Errors = this.ErrorMsgs;
      let optResp = new OperationResponse(null, '', responseStatus);
      this.msgDialogService.OpenDialog(optResp);

      this.IsValid = false;
    }
    else {
      let pwdLenMinLabel = this.LangPack.hasOwnProperty('SysInfo_PwdLengthMin') ? this.LangPack['SysInfo_PwdLengthMin'] : 'SysInfo_PwdLengthMin';
      let pwdLenMaxLabel = this.LangPack.hasOwnProperty('SysInfo_PwdLengthMax') ? this.LangPack['SysInfo_PwdLengthMax'] : 'SysInfo_PwdLengthMax';
      let erroMsg = this.LangPack.hasOwnProperty('E041') ? this.LangPack['E041'] : '{0} must be greater than or equal to {1}.';

      erroMsg = erroMsg.replace("{0}", pwdLenMaxLabel);
      erroMsg = erroMsg.replace("{1}", pwdLenMinLabel);

      if (this.ErrorMsgs != null) {
        let indexOfMsg = -1;
        for (let i = 0; i < this.ErrorMsgs.length; ++i) {
          if (this.ErrorMsgs[i].Message == erroMsg) {
            indexOfMsg = i;
            break;
          }
        }

        this.ErrorMsgs.splice(indexOfMsg, 1);
      }

      if (this.ErrorMsgs.length == 0 || this.ErrorMsgs == null) {
        this.IsValid = true;
      }
    }
  }
  //#endregion

  //#region [ Event -- Save Button Event ]
  OnSave() {
    if (this.IsValid) {

      if (this.AuthKey != null && this.AuthKey != "") {
        this.loadingDialogSer.OpenLoadingDialog();

        this.sysInfoSer.editSysInfo(this.SysInfoVMInst).subscribe(
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
    }
    else {
      let responseStatus = new ResponseStatus();
      responseStatus.ErrorCode = "01";

      //ValidationFailed
      let validationFailedLabel = this.LangPack.hasOwnProperty('ValidationFailed') ? this.LangPack['ValidationFailed'] : 'ValidationFailed';

      responseStatus.Message = validationFailedLabel;
      responseStatus.Errors = this.ErrorMsgs;
      let optResp = new OperationResponse(null, '', responseStatus);
      this.msgDialogService.OpenDialog(optResp);
    }
  }
  //#endregion
}
