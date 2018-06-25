import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';

//Component
import { CoolComponent } from "../../../components/common/cool-component";
import { listAnimation } from "../../../cool-privilege-animation";

//Module
import { SearchableVm } from "../../../models/searchable-vm";

//Service
import { RoutingHistoryService } from "../../../services/routing-history.service";
import { PrivilegeCheckService } from "../../../services/privilege-check.service";
import { PrivilegeService } from "../../../services/privilege.service";
import { LoginService } from "../../../services/login.service";
import { LoadingDialogService } from '../../../services/loading-dialog.service';
import { MsgDialogService } from '../../../services/msg-dialog.service';

import { LangMgtService } from "../../../services/lang-mgt.service";

@Component({
  selector: 'app-lang-list',
  templateUrl: './lang-list.component.html',
  styleUrls: ['./lang-list.component.css'],
  animations: [
    // slideUpDownAnimation(32), // will return trigger named "slideUpDownAnimation32"
    listAnimation()
  ]
})
export class LangListComponent extends CoolComponent implements OnInit {
  public LangList: any[] = [];

  public SearchCriteria = {
    LanguageKey: "",
    LanguageDesc: "",
    Priority: null,
  };

  constructor(private route: ActivatedRoute, protected router: Router, public langSer: LangMgtService, public loadingDialogSer: LoadingDialogService, public msgDialogService: MsgDialogService, public loginSer: LoginService, public routingHistorySer: RoutingHistoryService, public pirvilegeCheckSer: PrivilegeCheckService, public privilegeComponentSer: PrivilegeService) {
    super(loginSer, msgDialogService, pirvilegeCheckSer, privilegeComponentSer, router);

    this.FuncKey = "LangMgt";
    this.FuncListKey = "LangList";

    this.privilegeComponentSer.onGetPrivilegeCallBackEvent.subscribe((PrivilegeTypeInst) => {
      this.PrivilegeTypeInst = PrivilegeTypeInst;
    });
  }

  //#region [ Navigate Router ]
  navigateRouter(command: any[]) {
    this.queryParms = {
      PageIndex: this.PageIndex,
      SortColumn: this.SortColumn,
      SortDir: this.SortDir,
      LanguageKey: this.SearchCriteria.LanguageKey,
      LanguageDesc: this.SearchCriteria.LanguageDesc,
      Priority: this.SearchCriteria.Priority
    }
    super.navigateRouter(command);
  }
  //#endregion

  //#region [ Event -- Sort Language ]
  OnSort(header: string) {
    this.sort(header, ["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  //#region [ Event -- Clear ]
  OnClear() {
    this.SearchCriteria.LanguageKey = "";
    this.SearchCriteria.LanguageDesc = "";
    this.SearchCriteria.Priority = null;
    this.OnSearch();
  }
  //#endregion

  //#region [ Event -- Search Language ]
  OnSearch() {
    this.PageIndex = 1;
    this.navigateRouter(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  //#region [ Event -- Delete Language ]
  OnDel(langId: string) {
    this.IsClickDel = true;
    if (this.AuthKey != null && this.AuthKey != "") {
      this.loadingDialogSer.OpenLoadingDialog();
      this.langSer.getLangByLangId(this.LangKey, langId).subscribe(
        resp => {
          if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
            if (resp.Inst != null) {
              this.langSer.delLang(resp.Inst).subscribe(
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

  //#region [ Event -- Edit Language ]
  OnEdit(funcId: string) {
    this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, "EditLang", funcId]);
  }
  //#endregion

  //#region [ Create Language ]
  OnCreate() {
    this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, "CreateLang"]);
  }
  //#endregion

  //#region [ Event -- Page Change ]
  OnPageChange(PGIndex: number) {
    this.PageIndex = PGIndex;
    this.navigateRouter(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  getSearchCriteria(): any {
    if (this.SearchCriteria.LanguageKey == "" && this.SearchCriteria.LanguageDesc == "" && this.SearchCriteria.Priority == null) {
      return null;
    }
    else {
      return this.SearchCriteria;
    }
  }

  //#region [ Get Language List ]
  private getLangList() {
    //Search Function
    let searchableVM = new SearchableVm();
    searchableVM.VMInst = this.getSearchCriteria();
    searchableVM.PageIndex = this.PageIndex;
    searchableVM.SortColumn = this.SortColumn;
    searchableVM.SortDir = this.SortDir;
    searchableVM.LangKey = this.LangKey;

    if (this.AuthKey != null && this.AuthKey != "") {
      this.loadingDialogSer.OpenLoadingDialog();
      this.langSer.searchLangList(searchableVM).subscribe(
        resp => {
          if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
            if (resp.Inst != null) {
              this.LangList = resp.Inst;
            }

            this.TotalCount = resp.RecordCount;

            this.loadingDialogSer.refreshAuthKey(resp);
          }
          else if (resp != null) {
            this.TotalCount = 0;
            this.PageIndex = 1;
            this.loadingDialogSer.refreshAuthKey(resp);
            this.LangList = [];

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
    if (urlParams.hasOwnProperty("LanguageKey")) {
      let langKey = urlParams["LanguageKey"];
      this.SearchCriteria.LanguageKey = langKey;
    }

    if (urlParams.hasOwnProperty("LanguageDesc")) {
      let langDesc = urlParams["LanguageDesc"];
      this.SearchCriteria.LanguageDesc = langDesc;
    }

    if (urlParams.hasOwnProperty("Priority")) {
      let priority = urlParams["Priority"];
      this.SearchCriteria.Priority = priority;
    }
    super.initSetExtraParam(urlParams);
  }

  initOtherFuncs() {
    this.msgDialogService.onClosedEvent.subscribe(optResp => {
      if (this.IsClickDel) {
        if (this.PageIndex == 1) {
          this.getLangList();
        }
        else {
          this.PageIndex = 1;
          this.OnSearch();
        }
        this.IsClickDel = false;
      }
    });

    this.getLangList();

    super.initOtherFuncs();
  }

  ngOnInit() {
    this.initList(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey], this.route.queryParams, "Priority", "asc");
  }
  //#endregion
}
