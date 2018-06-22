import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorage, SessionStorage } from 'ngx-webstorage';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators'
import { Observable } from 'rxjs';

import { Error } from '../../cool-privilege-control/models/common/error';
import { OperationResponse } from '../../cool-privilege-control/models/common/operation-response';
import { ResponseStatus } from '../../cool-privilege-control/models/common/response-status';
import { LoginUserVm } from '../../cool-privilege-control/models/login-user-vm';
import { LoginService } from '../../cool-privilege-control/services/login.service';
import { LoadingDialogService } from '../../cool-privilege-control/services/loading-dialog.service'
import { MsgDialogService } from '../../cool-privilege-control/services/msg-dialog.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginUserVM: LoginUserVm;
  LanguageList: any;
  langKey: string;

  @LocalStorage()
  LangPack: any = {};

  @LocalStorage()
  AuthKey: string = "";

  constructor(private route: ActivatedRoute,
    private router: Router, public loadingDialogSer: LoadingDialogService, public msgDialogService: MsgDialogService, public loginSer: LoginService) {
    this.loginUserVM = new LoginUserVm();
    this.loginUserVM.LanguageKey = "en";
  }

  //#region [ Method -- Get Language List ]
  getLangList() {
    this.loadingDialogSer.OpenLoadingDialog();
    this.loginSer.getLangList().subscribe(
      resp => {
        if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
          if (resp.Inst != null) {
            this.LanguageList = resp.Inst;
          }
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

  //#region [ Init Event ]
  ngOnInit() {
    //Get language list
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has("LangKey")) {
        this.loginUserVM.LanguageKey = params.get("LangKey");
        if (this.loginUserVM.LanguageKey != null) {
          this.getLangList();

          this.loadingDialogSer.GetLangRes(this.loginUserVM.LanguageKey);
        }
      }
      else {
        this.router.navigate(["login", "en"]);
      }
    }
    );

    //Get resource by language key
    this.loadingDialogSer.onLangChangeEvent.subscribe(langPack => {
      this.LangPack = langPack;
    });

    this.msgDialogService.onClosedEvent.subscribe(optResp => {

    });
  }
  //#endregion

  //#region [ Event -- Login button event ]
  OnLogin() {
    this.loadingDialogSer.OpenLoadingDialog();
    this.langKey = this.loginUserVM.LanguageKey;

    this.loginSer.login(this.loginUserVM).subscribe(
      resp => {
        if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
          this.AuthKey = resp.CoolJWToken;
          this.loadingDialogSer.refreshAuthKey(resp.CoolJWToken);
          this.router.navigate(['CoolPrivilegeControl', this.langKey]);
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

  //#region [ Event -- Change Language event ]
  OnChangeLang(langKey: string) {
    if (langKey != null) {
      this.router.navigate(["login", langKey]);
    }
  }
  //#endregion

}
