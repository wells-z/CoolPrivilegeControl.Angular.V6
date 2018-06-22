import { Component, ElementRef, ViewChild, OnInit, OnChanges, Inject, NgModule, SimpleChanges } from '@angular/core';
// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { DomSanitizer } from '@angular/platform-browser';
// import { MatIconRegistry } from '@angular/material';
// import { CookieStorage, LocalStorage, SessionStorage,TempStorage } from 'ngx-store';
import { LocalStorage, SessionStorage } from 'ngx-webstorage';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { trigger, state, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { FlexLayoutModule } from "@angular/flex-layout";

//Components
import { CoolComponent } from "../../components/common/cool-component";
import { listAnimation } from "../../cool-privilege-animation";

//Models
import { Error } from '../../models/common/error';
import { OperationResponse } from '../../models/common/operation-response';
import { ResponseStatus } from '../../models/common/response-status';
import { SearchableVm } from "../../models/searchable-vm";
import { PrivilegeTypeVm } from "../../models/privilege-type-vm";
import { FuncTypeVm } from "../../models/func-type-vm";

//Service
import { FuncMgtService } from "../../services/func-mgt.service";
import { RoutingHistoryService } from "../../services/routing-history.service";
import { PrivilegeCheckService } from "../../services/privilege-check.service";
import { PrivilegeService } from "../../services/privilege.service";
import { LoginService } from "../../services/login.service";
import { LoadingDialogService } from '../../services/loading-dialog.service';
import { MsgDialogService } from '../../services/msg-dialog.service';


@Component({
  selector: 'app-func-list',
  templateUrl: './func-list.component.html',
  styleUrls: ['./func-list.component.css'],
  animations: [
    // slideUpDownAnimation(32), // will return trigger named "slideUpDownAnimation32"
    listAnimation()
  ]
})
export class FuncListComponent extends CoolComponent implements OnInit {
  public FuncList: any[] = [];

  public SearchCriteria = {
    FuncPath: "",
    FuncKey: "",
    Status: "null"
  };

  constructor(private route: ActivatedRoute, protected router: Router, public funcSer: FuncMgtService, public loadingDialogSer: LoadingDialogService, public msgDialogService: MsgDialogService, public loginSer: LoginService, public routingHistorySer: RoutingHistoryService, public pirvilegeCheckSer: PrivilegeCheckService, public privilegeComponentSer: PrivilegeService) {
    super(loginSer, msgDialogService, pirvilegeCheckSer, privilegeComponentSer, router);

    this.FuncKey = "FuncMgt";
    this.FuncListKey = "FuncList";
  }

  //#region [ Navigate Router ]
  navigateRouter(command: any[]) {
    this.queryParms = {
      PageIndex: this.PageIndex,
      SortColumn: this.SortColumn,
      SortDir: this.SortDir,
      FuncPath: this.SearchCriteria.FuncPath,
      FuncKey: this.SearchCriteria.FuncKey,
      Status: this.SearchCriteria.Status,
    }
    super.navigateRouter(command);
  }
  //#endregion

  //#region [ Event -- Sort Function ]
  OnSort(header: string) {
    this.sort(header, ["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  //#region [ Event -- Clear ]
  OnClear() {
    this.SearchCriteria.FuncPath = "";
    this.SearchCriteria.FuncKey = "";
    this.SearchCriteria.Status = "null";
    this.OnSearch();
  }
  //#endregion

  //#region [ Event -- Search Function ]
  OnSearch() {
    this.PageIndex = 1;
    this.navigateRouter(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  //#region [ Event -- Delete Function ]
  OnDel(funcId: string) {
    this.IsClickDel = true;
    this.loadingDialogSer.OpenLoadingDialog();
    this.funcSer.getFuncByFuncId(this.LangKey, funcId).subscribe(
      resp => {
        if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
          if (resp.Inst != null) {
            this.funcSer.delFunc(resp.Inst).subscribe(
              resp => {
                if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {

                  this.loadingDialogSer.refreshAuthKey(resp);

                  resp.ResponseStatus.Message = this.LangPack.hasOwnProperty('I001') ? this.LangPack['I001'] : 'Delete Successfully!';

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
  //#region

  //#region [ Event -- Edit Function ]
  OnEdit(funcId: string) {
    this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, "EditFunc", funcId]);
  }
  //#endregion

  //#region [ Create Function ]
  OnCreate() {
    this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, "CreateFunc"]);
  }
  //#endregion

  //#region [ Event -- Page Change ]
  OnPageChange(PGIndex: number) {
    this.PageIndex = PGIndex;
    this.navigateRouter(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  getSearchCriteria(): any {
    if (this.SearchCriteria.Status == "null" && this.SearchCriteria.FuncKey == "" && this.SearchCriteria.FuncPath == "") {
      return null;
    }
    else {
      return this.SearchCriteria;
    }
  }

  //#region [ Get Function List ]
  private getFuncList() {
    //Search Function
    let searchableVM = new SearchableVm();
    searchableVM.VMInst = this.getSearchCriteria();
    searchableVM.PageIndex = this.PageIndex;
    searchableVM.SortColumn = this.SortColumn;
    searchableVM.SortDir = this.SortDir;
    searchableVM.LangKey = this.LangKey;

    if (this.AuthKey != null && this.AuthKey != "") {
      this.loadingDialogSer.OpenLoadingDialog();
      this.funcSer.searchFuncList(searchableVM).subscribe(
        resp => {
          if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
            if (resp.Inst != null) {
              this.FuncList = resp.Inst;
            }
            this.TotalCount = resp.RecordCount;

            this.loadingDialogSer.refreshAuthKey(resp);
          }
          else if (resp != null) {
            this.TotalCount = 0;
            this.PageIndex = 1;
            this.loadingDialogSer.refreshAuthKey(resp);
            this.FuncList = [];

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
  }
  //#endregion

  //#region [ Initialize Event ]
  initSetExtraParam(urlParams: Params) {
    if (urlParams.hasOwnProperty("FuncPath")) {
      let funcPath = urlParams["FuncPath"];
      this.SearchCriteria.FuncPath = funcPath;
    }
    else {
      this.SearchCriteria.FuncPath = "";
    }

    if (urlParams.hasOwnProperty("FuncKey")) {
      let funcKey = urlParams["FuncKey"];
      this.SearchCriteria.FuncKey = funcKey;
    }
    else {
      this.SearchCriteria.FuncKey = "";
    }

    if (urlParams.hasOwnProperty("Status")) {
      let status = urlParams["Status"];
      this.SearchCriteria.Status = status;
    }
    else {
      this.SearchCriteria.Status = null;
    }
    super.initSetExtraParam(urlParams);
  }

  initOtherFuncs() {
    this.msgDialogService.onClosedEvent.subscribe(optResp => {
      if (this.IsClickDel) {
        if (this.PageIndex == 1) {
          this.getFuncList();
        }
        else {
          this.PageIndex = 1;
          this.OnSearch();
        }
        this.IsClickDel = false;
      }
    });

    this.getFuncList();

    super.initOtherFuncs();
  }

  ngOnInit() {
    this.initList(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey], this.route.queryParams, "FuncPath", "asc");
  }
  //#endregion
}
