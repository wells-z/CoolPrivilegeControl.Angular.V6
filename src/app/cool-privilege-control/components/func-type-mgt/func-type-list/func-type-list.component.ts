import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';

//Component
import { CoolComponent } from "../../../components/common/cool-component";
import { listAnimation } from "../../../cool-privilege-animation";

//Models
import { SearchableVm } from "../../../models/searchable-vm";

//Services
import { FuncTypeMgtService } from "../../../services/func-type-mgt.service";
import { RoutingHistoryService } from "../../../services/routing-history.service";
import { PrivilegeCheckService } from "../../../services/privilege-check.service";
import { PrivilegeService } from "../../../services/privilege.service";
import { LoginService } from "../../../services/login.service";
import { LoadingDialogService } from '../../../services/loading-dialog.service';
import { MsgDialogService } from '../../../services/msg-dialog.service';

@Component({
  selector: 'app-func-type-list',
  templateUrl: './func-type-list.component.html',
  styleUrls: ['./func-type-list.component.css'],
  animations: [
    // slideUpDownAnimation(32), // will return trigger named "slideUpDownAnimation32"
    listAnimation()
  ]
})
export class FuncTypeListComponent extends CoolComponent implements OnInit {
  public FuncTypeList: any[] = [];

  public SearchCriteria = {
    FuncTypeKey: "",
    Priority: null,
    Status: "null"
  };

  constructor(private route: ActivatedRoute, protected router: Router, public funcTypeSer: FuncTypeMgtService, public loadingDialogSer: LoadingDialogService, public msgDialogService: MsgDialogService, public loginSer: LoginService, public routingHistorySer: RoutingHistoryService, public pirvilegeCheckSer: PrivilegeCheckService, public privilegeComponentSer: PrivilegeService) {
    super(loginSer, msgDialogService, pirvilegeCheckSer, privilegeComponentSer, router);

    this.FuncKey = "FuncTMgt";
    this.FuncListKey = "FuncTypeList";
  }

  //#region [ Navigate Router ]
  navigateRouter(command: any[]) {
    this.queryParms = {
      PageIndex: this.PageIndex,
      SortColumn: this.SortColumn,
      SortDir: this.SortDir,
      FuncTypeKey: this.SearchCriteria.FuncTypeKey,
      Priority: this.SearchCriteria.Priority,
      Status: this.SearchCriteria.Status,
    }
    super.navigateRouter(command);
  }
  //#endregion

  //#region [ Event -- Sort Function Type ]
  OnSort(header: string) {
    this.sort(header, ["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  //#region [ Event -- Clear ]
  OnClear() {
    this.SearchCriteria.FuncTypeKey = "";
    this.SearchCriteria.Priority = null;
    this.SearchCriteria.Status = "null";
    this.OnSearch();
  }
  //#endregion

  //#region [ Event -- Search Function Type ]
  OnSearch() {
    this.PageIndex = 1;
    this.navigateRouter(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  //#region [ Event -- Delete Function Type ]
  OnDel(funcTId: string) {
    this.IsClickDel = true;
    if (this.AuthKey != null && this.AuthKey != "") {
      this.loadingDialogSer.OpenLoadingDialog();
      this.funcTypeSer.getFuncTypeByFuncTypeId(this.LangKey, funcTId).subscribe(
        resp => {
          if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
            if (resp.Inst != null) {
              this.funcTypeSer.delFuncType(resp.Inst).subscribe(
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
        });
    }
  }
  //#region

  //#region [ Event -- Edit Function Type ]
  OnEdit(funcId: string) {
    this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, "EditFuncType", funcId]);
  }
  //#endregion

  //#region [ Create Function Type ]
  OnCreate() {
    this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, "CreateFuncType"]);
  }
  //#endregion

  //#region [ Event -- Page Change ]
  OnPageChange(PGIndex: number) {
    this.PageIndex = PGIndex;
    this.navigateRouter(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  getSearchCriteria(): any {
    if (this.SearchCriteria.Status == "null" && this.SearchCriteria.FuncTypeKey == "" && this.SearchCriteria.Priority == null) {
      return null;
    }
    else {
      return this.SearchCriteria;
    }
  }

  //#region [ Get Function Type List ]
  private getFuncTypeList() {
    //Search Function
    let searchableVM = new SearchableVm();
    searchableVM.VMInst = this.getSearchCriteria();
    searchableVM.PageIndex = this.PageIndex;
    searchableVM.SortColumn = this.SortColumn;
    searchableVM.SortDir = this.SortDir;
    searchableVM.LangKey = this.LangKey;

    if (this.AuthKey != null && this.AuthKey != "") {
    this.loadingDialogSer.OpenLoadingDialog();
    this.funcTypeSer.searchFuncTypeList(searchableVM).subscribe(
      resp => {
        if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
          if (resp.Inst != null) {
            this.FuncTypeList = resp.Inst;
          }

          this.TotalCount = resp.RecordCount;

          this.loadingDialogSer.refreshAuthKey(resp);
        }
        else if (resp != null) {
          this.TotalCount = 0;
          this.PageIndex = 1;
          this.loadingDialogSer.refreshAuthKey(resp);
          this.FuncTypeList = [];

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
    if (urlParams.hasOwnProperty("Status")) {
      let status = urlParams["Status"];
      this.SearchCriteria.Status = status;
    }

    if (urlParams.hasOwnProperty("Priority")) {
      let priority = urlParams["Priority"];
      this.SearchCriteria.Priority = priority;
    }

    if (urlParams.hasOwnProperty("FuncTypeKey")) {
      let funcTypeKey = urlParams["FuncTypeKey"];
      this.SearchCriteria.FuncTypeKey = funcTypeKey;
    }
    super.initSetExtraParam(urlParams);
  }

  initOtherFuncs() {
    this.msgDialogService.onClosedEvent.subscribe(optResp => {
      if (this.IsClickDel) {
        if (this.PageIndex == 1) {
          this.getFuncTypeList();
        }
        else {
          this.PageIndex = 1;
          this.OnSearch();
        }
        this.IsClickDel = false;
      }
    });

    this.getFuncTypeList();

    super.initOtherFuncs();
  }

  ngOnInit() {
    this.initList(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey], this.route.queryParams, "Priority", "asc");
  }
  //#endregion
}