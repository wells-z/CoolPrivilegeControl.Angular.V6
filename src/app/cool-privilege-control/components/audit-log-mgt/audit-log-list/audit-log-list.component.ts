import { Component, OnInit } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Router, ActivatedRoute, Params } from '@angular/router';

import * as moment from 'moment';

//Components
import { CoolComponent } from "../../../components/common/cool-component";
import { listAnimation } from "../../../cool-privilege-animation";
import { AuditLogDetailComponent } from '../audit-log-detail/audit-log-detail.component';

//Models
import { SearchableVm } from "../../../models/searchable-vm";
import { PrivilegeTypeVm } from "../../../models/privilege-type-vm";
import { AuditLogVm } from '../../../models/audit-log-vm';

//Services
import { RoutingHistoryService } from "../../../services/routing-history.service";
import { PrivilegeCheckService } from "../../../services/privilege-check.service";
import { PrivilegeService } from "../../../services/privilege.service";
import { LoginService } from "../../../services/login.service";
import { LoadingDialogService } from '../../../services/loading-dialog.service';
import { MsgDialogService } from '../../../services/msg-dialog.service';

import { AuditLogMgtService } from "../../../services/audit-log-mgt.service";

@Component({
  selector: 'app-audit-log-list',
  templateUrl: './audit-log-list.component.html',
  styleUrls: ['./audit-log-list.component.css'],
  animations: [
    // slideUpDownAnimation(32), // will return trigger named "slideUpDownAnimation32"
    listAnimation()
  ]
})
export class AuditLogListComponent extends CoolComponent implements OnInit {
  //#region [ Search Criteria ]
  public SearchCriteria = {
    DateFrom: moment().add(-1, 'd').toDate(),
    DateTo: moment().toDate(),
    LoginName: ""
  };
  //#endregion

  //#region [ AuditLog List ]
  AuditLogList: any[] = [];
  //#endregion

  //#region [ Privilege Type ]
  PrivilegeTypeInst_LUser: PrivilegeTypeVm = new PrivilegeTypeVm();
  //#endregion

  auditLogDetailRef: MatDialogRef<AuditLogDetailComponent, any>;

  //#region [ Constructor ]
  constructor(private route: ActivatedRoute, protected router: Router, private auditLogSer: AuditLogMgtService, public loadingDialogSer: LoadingDialogService, protected msgDialogService: MsgDialogService, protected loginSer: LoginService, public routingHistorySer: RoutingHistoryService, protected pirvilegeCheckSer: PrivilegeCheckService, protected privilegeComponentSer: PrivilegeService, public dialog: MatDialog) {
    super(loginSer, msgDialogService, pirvilegeCheckSer, privilegeComponentSer, router);
    this.FuncKey = "AuditMgt";
    this.FuncListKey = "AuditLogList";
  }
  //#endregion

  //#region [ Event -- Sort Function ]
  OnSort(header: string) {
    this.sort(header, ["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  //#region [ Event -- Click Detail ]
  isFailureDialogOpened: boolean;
  OnClickDetail(auditLogVM: AuditLogVm) {
    this.auditLogDetailRef = this.dialog.open(AuditLogDetailComponent, {
      data: {
        AuditLogVM: auditLogVM
      }
    });

    this.auditLogDetailRef.afterClosed().subscribe(result => {
      this.resetIsOpened(false);
    });
  }

  resetIsOpened(isOpened: boolean) {
    this.isFailureDialogOpened = isOpened;
  }
  //#endregion

  //#region [ Event -- Clear ]
  OnClear() {
    this.SearchCriteria.LoginName = '';
    this.SearchCriteria.DateFrom = moment().add(-1, 'd').toDate();
    this.SearchCriteria.DateTo = moment().toDate();
    this.OnSearch();
  }
  //#endregion

  //#region [ Event -- Search Function ]
  OnSearch() {
    this.PageIndex = 1;
    this.navigateRouter(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  //#region [ Event -- Page Change ]
  OnPageChange(PGIndex: number) {
    this.PageIndex = PGIndex;
    this.navigateRouter(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  getSearchCriteria(): any {
    if (this.SearchCriteria.DateFrom == null && this.SearchCriteria.DateTo == null && this.SearchCriteria.LoginName == null) {
      return null;
    }
    else {
      return this.SearchCriteria;
    }
  }

  //#region [ Get Audit Log List ]
  private getAuditLogList() {
    //Search Author
    let searchableVM = new SearchableVm();
    searchableVM.VMInst = this.getSearchCriteria();
    searchableVM.PageIndex = this.PageIndex;
    searchableVM.SortColumn = this.SortColumn;
    searchableVM.SortDir = this.SortDir;
    searchableVM.LangKey = this.LangKey;

    if (this.AuthKey != null && this.AuthKey != "") {
      this.loadingDialogSer.OpenLoadingDialog();
      this.auditLogSer.searchAuditLogList(searchableVM).subscribe(
        resp => {
          if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
            if (resp.Inst != null) {
              this.AuditLogList = resp.Inst;

              for (let i = 0; i < this.AuditLogList.length; ++i) {
                this.AuditLogList[i].CreateDate = moment(this.AuditLogList[i].CreateDate).format(this.DateFormat + " " + this.TimeFormat)
              }
            }
            this.TotalCount = resp.RecordCount;

            this.loadingDialogSer.refreshAuthKey(resp);
          }
          else if (resp != null) {
            this.TotalCount = 0;
            this.PageIndex = 1;
            this.loadingDialogSer.refreshAuthKey(resp);
            this.AuditLogList = [];

            // this.msgDialogService.OpenDialog(resp);
          }

          this.loadingDialogSer.CloseLoadingDialog();
        },
        err => {
          this.TotalCount = 0;
          this.PageIndex = 1;
          this.msgDialogService.OpenFailureDialog(err);
          this.loadingDialogSer.CloseLoadingDialog();
        });
    }
  }
  //#endregion

  //#region [ Navigate Router ]
  navigateRouter(command: any[]) {
    this.queryParms = {
      PageIndex: this.PageIndex,
      SortColumn: this.SortColumn,
      SortDir: this.SortDir,
      LoginName: this.SearchCriteria.LoginName,
      DateFrom: moment(this.SearchCriteria.DateFrom).format('YYYY-MM-DD'),
      DateTo: moment(this.SearchCriteria.DateTo).format('YYYY-MM-DD')
    }
    super.navigateRouter(command);
  }
  //#endregion

  //#region [ Initialize Event ]
  initSetExtraParam(urlParams: Params) {
    if (urlParams.hasOwnProperty("DateFrom")) {
      let dateFrom = urlParams["DateFrom"];
      this.SearchCriteria.DateFrom = moment(dateFrom).toDate();
    }
    else {
      this.SearchCriteria.DateFrom = moment().add(-1, 'd').toDate();
    }

    if (urlParams.hasOwnProperty("DateTo")) {
      let dateTo = urlParams["DateTo"];
      this.SearchCriteria.DateTo = moment(dateTo).toDate();
    }
    else {
      this.SearchCriteria.DateTo = moment().toDate();
    }

    if (urlParams.hasOwnProperty("LoginName")) {
      let loginName = urlParams["LoginName"];
      this.SearchCriteria.LoginName = loginName;
    }
    else {
      this.SearchCriteria.LoginName = "";
    }
    super.initSetExtraParam(urlParams);
  }

  Callback_getPrivilegeInstByFuncKey(strFuncKey: string, privilegeVM: PrivilegeTypeVm) {
    if (strFuncKey == "LUserMgt") {
      this.PrivilegeTypeInst_LUser = privilegeVM;
    }
    super.Callback_getPrivilegeInstByFuncKey(strFuncKey, privilegeVM);
  }

  initOtherFuncs() {
    this.msgDialogService.onClosedEvent.subscribe(optResp => {
      if (this.IsClickDel) {
        if (this.PageIndex == 1) {
          this.getAuditLogList();
        }
        else {
          this.PageIndex = 1;
          this.OnSearch();
        }
        this.IsClickDel = false;
      }
    });

    this.getAuditLogList();

    this.getPrivilegeInstByFuncKey("LUserMgt");

    super.initOtherFuncs();
  }

  ngOnInit() {
    this.initList(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey], this.route.queryParams, "CreateDate", "desc");
  }
  //#endregion
}
