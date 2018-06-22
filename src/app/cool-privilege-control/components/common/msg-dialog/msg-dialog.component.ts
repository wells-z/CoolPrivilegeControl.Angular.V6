import { Component, OnInit } from '@angular/core';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
// import { CookieStorage, LocalStorage, SessionStorage } from 'ngx-store';
import { LocalStorage, SessionStorage } from 'ngx-webstorage';

import { Error } from '../../../models/common/error';
import { OperationResponse } from '../../../models/common/operation-response';
import { ResponseStatus } from '../../../models/common/response-status';
import { DialogComponent } from '../dialog/dialog.component';

//Service
import { MsgDialogService } from "../../../services/msg-dialog.service";

@Component({
  selector: 'app-msg-dialog',
  templateUrl: './msg-dialog.component.html',
  styleUrls: ['./msg-dialog.component.css']
})
export class MsgDialogComponent implements OnInit {
  isFailureDialogOpened: boolean;

  @LocalStorage()
  public LangKey: string;

  dialogRef: MatDialogRef<DialogComponent, any>;

  constructor(public msgDialogService: MsgDialogService, public dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    this.msgDialogService.onOpenDialogEvent.subscribe(optResp => {
      if (!this.isFailureDialogOpened) {

        this.resetIsOpened(true);

        if (optResp.ResponseStatus != null && optResp.ResponseStatus.ErrorCode == "01") {
          this.dialogRef = this.dialog.open(DialogComponent, {
            data: {
              OptResp: optResp
            }
          });

          this.dialogRef.afterClosed().subscribe(result => {
            this.resetIsOpened(false);

            this.msgDialogService.ClosedDialog(optResp);
            if (optResp.ResponseStatus.ErrorCode == "401") {
              window.location.href = window.location.href.substr(0, window.location.href.indexOf("CoolPrivilegeControl")) + "login/" + this.LangKey;
              //this.router.navigate(["/login", this.LangKey], { preserveFragment: true, preserveQueryParams: false });
            }
          });
        }
        else {
          this.dialogRef = this.dialog.open(DialogComponent, {
            data: {
              OptResp: optResp
            }
          });

          this.dialogRef.afterClosed().subscribe(result => {
            this.resetIsOpened(false);

            this.msgDialogService.ClosedDialog(optResp);
            if (optResp.ResponseStatus.ErrorCode == "401") {
              window.location.href = window.location.href.substr(0, window.location.href.indexOf("CoolPrivilegeControl")) + "login/" + this.LangKey;
              // this.router.navigate(["/login", this.LangKey], { preserveFragment: false, preserveQueryParams: false });
            }
          });
        }
      }
    });
  }

  resetIsOpened(isOpened: boolean) {
    this.isFailureDialogOpened = isOpened;
  }
}
