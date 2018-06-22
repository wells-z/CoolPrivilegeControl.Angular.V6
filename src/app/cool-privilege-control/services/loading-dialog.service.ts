import { Injectable, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
// import { CookieStorage, LocalStorage, SessionStorage } from 'ngx-store';
import { LocalStorage, SessionStorage } from 'ngx-webstorage';

import { Error } from '../models/common/error';
import { OperationResponse } from '../models/common/operation-response';
import { ResponseStatus } from '../models/common/response-status';
import { DialogComponent } from '../components/common/dialog/dialog.component';

import { LoginService } from '../services/login.service'
import { MsgDialogService } from './msg-dialog.service'

@Injectable({
  providedIn: 'root'
})
export class LoadingDialogService {

  isOpen = false;

  dialogRef: MatDialogRef<DialogComponent, any>;

  @Output() onToggerEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() onLangChangeEvent: EventEmitter<{}> = new EventEmitter();

  @LocalStorage()
  public LangKey: string;


  constructor(public loginSer: LoginService, public msgDialogService:MsgDialogService, public dialog: MatDialog, private router: Router) {

  }

  OpenLoadingDialog() {
    this.isOpen = true;
    this.onToggerEvent.emit(true);
  }

  CloseLoadingDialog() {
    this.isOpen = false;
    this.onToggerEvent.emit(false);
  }

  GetLangRes(langKey: string) {
    this.OpenLoadingDialog();
    this.loginSer.getAllLangRes(langKey).subscribe(
      resp => {
        if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
          this.onLangChangeEvent.emit(resp.Inst);
        }
        else {
          //ToDo: Cannot get language package issue
        }
        this.CloseLoadingDialog();
      },
      err => {
        // this.OpenDialog(optResp);
        this.msgDialogService.OpenFailureDialog(err);
        this.CloseLoadingDialog();
      }
    );
  }

  refreshAuthKey(resp: any) {
    this.loginSer.refreshAuthKey(resp);
  }
}
