import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

//Components
import { CoolComponent } from "../../../components/common/cool-component";

//Models
import { LangVm } from "../../../models/lang-vm";

//Services
import { RoutingHistoryService } from "../../../services/routing-history.service";
import { LoginService } from "../../../services/login.service";
import { LoadingDialogService } from '../../../services/loading-dialog.service';
import { MsgDialogService } from '../../../services/msg-dialog.service';
import { PrivilegeService } from "../../../services/privilege.service";
import { PrivilegeCheckService } from "../../../services/privilege-check.service";

import { LangMgtService } from "../../../services/lang-mgt.service";

@Component({
  selector: 'app-create-lang',
  templateUrl: './create-lang.component.html',
  styleUrls: ['./create-lang.component.css']
})
export class CreateLangComponent extends CoolComponent implements OnInit {
  LangVMInst: LangVm = new LangVm();

  LangDetailGroup: FormGroup;

  isLinear = true;

  constructor(private _formBuilder: FormBuilder, protected route: ActivatedRoute, protected router: Router, private langSer: LangMgtService, private loadingDialogSer: LoadingDialogService, protected msgDialogService: MsgDialogService, protected loginSer: LoginService, protected privilegeComponentSer: PrivilegeService, protected pirvilegeCheckSer: PrivilegeCheckService, private routingHistorySer: RoutingHistoryService) {
    super(loginSer, msgDialogService, pirvilegeCheckSer, privilegeComponentSer, router);

    this.FuncKey = "LangMgt";
    this.FuncListKey = "LangList";

    this.LangDetailGroup = new FormGroup({
      LanguageKey: new FormControl({ value: '', disabled: false }, Validators.required),
      LanguageDesc: new FormControl({ value: '', disabled: false }, Validators.required),
      Priority: new FormControl({ value: null, disabled: false }, Validators.required),
    });
  }

  //#region [ Evnet -- Language Key Change Event ]
  OnChangeLangKey() {
    this.LangVMInst.LanguageKey = this.LangDetailGroup.get('LanguageKey').value;
  }
  //#endregion

  //#region [ Evnet -- Language Description Change Event ]
  OnChangeLangDesc() {
    this.LangVMInst.LanguageDesc = this.LangDetailGroup.get('LanguageDesc').value;
  }
  //#endregion

  //#region [ Evnet -- Priority Change Event ]
  OnChangePriority() {
    this.LangVMInst.Priority = this.LangDetailGroup.get('Priority').value;
  }
  //#endregion

  //#region [ Event -- Back To List Button Event ]
  OnBackToList() {
    this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //endregion

  //#region [ Event -- Save Button Event ]
  OnSave() {
    if (this.AuthKey != null && this.AuthKey != "") {
      this.loadingDialogSer.OpenLoadingDialog();
      this.langSer.createLang(this.LangVMInst).subscribe(
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
  }
  //#endregion
}
