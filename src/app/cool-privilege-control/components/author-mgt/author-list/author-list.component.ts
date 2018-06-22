import { Component, OnInit } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Router, ActivatedRoute, Params } from '@angular/router';

import * as moment from 'moment';

//Components
import { CoolComponent } from "../../../components/common/cool-component";
import { listAnimation } from "../../../cool-privilege-animation";
import { AuthorDetailComponent } from '../author-detail/author-detail.component';

//Models
import { SearchableVm } from "../../../models/searchable-vm";
import { PrivilegeTypeVm } from "../../../models/privilege-type-vm";
import { AuthorVm } from '../../../models/author-vm';

//Services
import { RoutingHistoryService } from "../../../services/routing-history.service";
import { PrivilegeCheckService } from "../../../services/privilege-check.service";
import { PrivilegeService } from "../../../services/privilege.service";
import { LoginService } from "../../../services/login.service";
import { LoadingDialogService } from '../../../services/loading-dialog.service';
import { MsgDialogService } from '../../../services/msg-dialog.service';

import { AuthorMgtService } from "../../../services/author-mgt.service";

@Component({
  selector: 'app-author-list',
  templateUrl: './author-list.component.html',
  styleUrls: ['./author-list.component.css'],
  animations: [
    // slideUpDownAnimation(32), // will return trigger named "slideUpDownAnimation32"
    listAnimation()
  ]
})
export class AuthorListComponent extends CoolComponent implements OnInit {
  //#region [ Search Criteria ]
  public SearchCriteria = {
    DateFrom: moment().add(-1, 'd').toDate(),
    DateTo: moment().toDate()
  };
  //#endregion

  //#region [ Author List ]
  AuthorList: any[] = [];
  //#endregion

  //#region [ Privilege Type ]
  PrivilegeTypeInst_Func: PrivilegeTypeVm = new PrivilegeTypeVm();

  PrivilegeTypeInst_FuncT: PrivilegeTypeVm = new PrivilegeTypeVm();

  PrivilegeTypeInst_LUser: PrivilegeTypeVm = new PrivilegeTypeVm();
  //#endregion

  authorDetailRef: MatDialogRef<AuthorDetailComponent, any>;

  //#region [ Constructor ]
  constructor(private route: ActivatedRoute, protected router: Router, private authorSer: AuthorMgtService, public loadingDialogSer: LoadingDialogService, protected msgDialogService: MsgDialogService, protected loginSer: LoginService, public routingHistorySer: RoutingHistoryService, protected pirvilegeCheckSer: PrivilegeCheckService, protected privilegeComponentSer: PrivilegeService, public dialog: MatDialog, ) {
    super(loginSer, msgDialogService, pirvilegeCheckSer, privilegeComponentSer, router);
    this.FuncKey = "AuthorMgt";
    this.FuncListKey = "AuthorList";
  }
  //#endregion

  //#region [ Event -- Sort Function ]
  OnSort(header: string) {
    this.sort(header, ["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  isFailureDialogOpened: boolean;
  OnClickDetail(authorVM: AuthorVm) {
    this.authorDetailRef = this.dialog.open(AuthorDetailComponent, {
      data: {
        AuthorVM: authorVM
      }
    });

    this.authorDetailRef.afterClosed().subscribe(result => {
      this.resetIsOpened(false);
    });
  }

  resetIsOpened(isOpened: boolean) {
    this.isFailureDialogOpened = isOpened;
  }

  //#region [ Event -- Clear ]
  OnClear() {
    this.SearchCriteria.DateFrom = moment().add(-1, 'd').toDate();
    this.SearchCriteria.DateTo = moment().toDate();
    this.OnSearch();
  }
  //#endregion

  //#region [ Event -- Search Function ]
  OnSearch() {
    // this.SearchCriteria.DateFrom = moment(this.SearchCriteria.DateFrom).format('YYYY-MM-DD');
    // this.SearchCriteria.DateTo = moment(this.SearchCriteria.DateTo).format('YYYY-MM-DD');
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
    if (this.SearchCriteria.DateFrom == null && this.SearchCriteria.DateTo == null) {
      return null;
    }
    else {
      return this.SearchCriteria;
    }
  }

  //#region [ Get Author List ]
  private getAuthorList() {
    //Search Author
    let searchableVM = new SearchableVm();
    searchableVM.VMInst = this.getSearchCriteria();
    searchableVM.PageIndex = this.PageIndex;
    searchableVM.SortColumn = this.SortColumn;
    searchableVM.SortDir = this.SortDir;
    searchableVM.LangKey = this.LangKey;

    this.loadingDialogSer.OpenLoadingDialog();
    this.authorSer.searchAuthorList(searchableVM).subscribe(
      resp => {
        if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
          if (resp.Inst != null) {
            this.AuthorList = resp.Inst;

            for (let i = 0; i < this.AuthorList.length; ++i) {
              this.AuthorList[i].AuthorDT = moment(this.AuthorList[i].AuthorDT).format(this.DateFormat + " " + this.TimeFormat)
            }
          }
          this.TotalCount = resp.RecordCount;

          this.loadingDialogSer.refreshAuthKey(resp);
        }
        else if (resp != null) {
          this.TotalCount = 0;
          this.PageIndex = 1;
          this.loadingDialogSer.refreshAuthKey(resp);
          this.AuthorList = [];

          this.msgDialogService.OpenDialog(resp);
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
  //#endregion

  //#region [ Navigate Router ]
  navigateRouter(command: any[]) {
    this.queryParms = {
      PageIndex: this.PageIndex,
      SortColumn: this.SortColumn,
      SortDir: this.SortDir,
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
      // let df=moment().add(-1, 'd').format('YYYY-MM-DD');
      this.SearchCriteria.DateFrom = moment().add(-1, 'd').toDate();
    }

    if (urlParams.hasOwnProperty("DateTo")) {
      let dateTo = urlParams["DateTo"];
      this.SearchCriteria.DateTo = moment(dateTo).toDate();
    }
    else {
      this.SearchCriteria.DateTo = moment().toDate();
    }
    super.initSetExtraParam(urlParams);
  }

  Callback_getPrivilegeInstByFuncKey(strFuncKey: string, privilegeVM: PrivilegeTypeVm) {

    if (strFuncKey == "FuncMgt") {
      this.PrivilegeTypeInst_Func = privilegeVM;
    }
    else if (strFuncKey == "FuncTMgt") {
      this.PrivilegeTypeInst_FuncT = privilegeVM;
    }
    else if (strFuncKey == "LUserMgt") {
      this.PrivilegeTypeInst_LUser = privilegeVM;
    }
    super.Callback_getPrivilegeInstByFuncKey(strFuncKey, privilegeVM);
  }

  initOtherFuncs() {
    this.msgDialogService.onClosedEvent.subscribe(optResp => {
      if (this.IsClickDel) {
        if (this.PageIndex == 1) {
          this.getAuthorList();
        }
        else {
          this.PageIndex = 1;
          this.OnSearch();
        }
        this.IsClickDel = false;
      }
    });

    this.getAuthorList();

    this.getPrivilegeInstByFuncKey("FuncMgt");

    this.getPrivilegeInstByFuncKey("FuncTMgt");

    this.getPrivilegeInstByFuncKey("LUserMgt");

    super.initOtherFuncs();
  }

  ngOnInit() {
    this.initList(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey], this.route.queryParams, "AuthorDT", "asc");
  }
  //#endregion
}
