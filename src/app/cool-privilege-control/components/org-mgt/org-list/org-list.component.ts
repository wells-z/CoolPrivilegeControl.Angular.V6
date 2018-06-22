import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';

//Component
import { CoolComponent } from "../../../components/common/cool-component";
import { listAnimation } from "../../../cool-privilege-animation";

//Models
import { SearchableVm } from "../../../models/searchable-vm";

//Services
import { RoutingHistoryService } from "../../../services/routing-history.service";
import { PrivilegeCheckService } from "../../../services/privilege-check.service";
import { PrivilegeService } from "../../../services/privilege.service";
import { LoginService } from "../../../services/login.service";
import { LoadingDialogService } from '../../../services/loading-dialog.service';
import { MsgDialogService } from '../../../services/msg-dialog.service';

import { OrgMgtService } from "../../../services/org-mgt.service";

@Component({
  selector: 'app-org-list',
  templateUrl: './org-list.component.html',
  styleUrls: ['./org-list.component.css'],
  animations: [
    // slideUpDownAnimation(32), // will return trigger named "slideUpDownAnimation32"
    listAnimation()
  ]
})
export class OrgListComponent extends CoolComponent implements OnInit {
  //#region [ Search Criteria ]
  public SearchCriteriaOrg = {
    OrgPath: "",
    OrgKey: "",
    Status: null
  };
  //#endregion

  //#region [ Organization List ]
  OrgList: any[] = [];
  //#endregion

  //#region [ Constructor ]
  constructor(private route: ActivatedRoute, protected router: Router, private orgSer: OrgMgtService, public loadingDialogSer: LoadingDialogService, protected msgDialogService: MsgDialogService, protected loginSer: LoginService, public routingHistorySer: RoutingHistoryService, protected pirvilegeCheckSer: PrivilegeCheckService, protected privilegeComponentSer: PrivilegeService) {
    super(loginSer, msgDialogService, pirvilegeCheckSer, privilegeComponentSer, router);
    this.FuncKey = "OrgMgt";
    this.FuncListKey = "OrgList";
  }
  //#endregion

  //#region [ Event -- Sort Organization ]
  OnSort(header: string) {
    this.sort(header, ["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  //#region [ Event -- Search Organization ]
  OnSearch() {
    this.PageIndex = 1;
    this.navigateRouter(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  //#region [ Event -- Delete Organization ]
  OnDel(orgId: string) {
    this.IsClickDel = true;
    this.loadingDialogSer.OpenLoadingDialog();
    this.orgSer.getOrgByOrgId(this.LangKey, orgId).subscribe(
      resp => {
        if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
          if (resp.Inst != null) {
            this.orgSer.delOrg(resp.Inst).subscribe(
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

          this.loadingDialogSer.CloseLoadingDialog();
        }
      },
      err => {
        this.msgDialogService.OpenFailureDialog(err);
        this.loadingDialogSer.CloseLoadingDialog();
      }
    );
  }
  //#endregion

  //#region [ Event -- Edit Organization ]
  OnEdit(orgDId: string) {
    this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, "EditOrg", orgDId]);
  }
  //#endregion

  //#region [ Event -- Create Organization ]
  OnCreate() {
    this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, "CreateOrg"]);
  }
  //#endregion

  //#region [ Event -- Page Change ]
  OnPageChange(PGIndex: number) {
    this.PageIndex = PGIndex;
    this.navigateRouter(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  getSearchCriteria(): any {
    if (this.SearchCriteriaOrg.OrgKey == "" && this.SearchCriteriaOrg.OrgPath == "" && this.SearchCriteriaOrg.Status == null) {
      return null;
    }
    else {
      return this.SearchCriteriaOrg;
    }
  }

  //#region [ Get Organization List ]
  private getOrgList() {
    //Search Organization
    let searchableVM = new SearchableVm();
    searchableVM.VMInst = this.getSearchCriteria();;
    searchableVM.PageIndex = this.PageIndex;
    searchableVM.SortColumn = this.SortColumn;
    searchableVM.SortDir = this.SortDir;
    searchableVM.LangKey = this.LangKey;

    this.loadingDialogSer.OpenLoadingDialog();
    this.orgSer.searchOrgList(searchableVM).subscribe(
      resp => {
        if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
          if (resp.Inst != null) {
            this.OrgList = resp.Inst;
          }
          this.TotalCount = resp.RecordCount;

          this.loadingDialogSer.refreshAuthKey(resp);
        }
        else if (resp != null) {
          this.TotalCount = 0;
          this.PageIndex = 1;
          this.loadingDialogSer.refreshAuthKey(resp);
          this.OrgList = [];

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
      OrgKey: this.SearchCriteriaOrg.OrgKey,
      OrgPath: this.SearchCriteriaOrg.OrgPath,
      Status: this.SearchCriteriaOrg.Status,
    }
    super.navigateRouter(command);
  }
  //#endregion

  //#region [ Initialize Event ]
  initSetExtraParam(urlParams: Params) {
    if (urlParams.hasOwnProperty("OrgKey")) {
      let orgKey = urlParams["OrgKey"];
      this.SearchCriteriaOrg.OrgKey = orgKey;
    }
    else {
      this.SearchCriteriaOrg.OrgKey = "";
    }

    if (urlParams.hasOwnProperty("OrgPath")) {
      let orgPath = urlParams["OrgPath"];
      this.SearchCriteriaOrg.OrgPath = orgPath;
    }
    else {
      this.SearchCriteriaOrg.OrgPath = "";
    }

    if (urlParams.hasOwnProperty("Status")) {
      let orgStatus = urlParams["Status"];
      this.SearchCriteriaOrg.Status = orgStatus;
    }
    else {
      this.SearchCriteriaOrg.Status = null;
    }
    super.initSetExtraParam(urlParams);
  }

  initOtherFuncs() {
    this.msgDialogService.onClosedEvent.subscribe(optResp => {
      if (this.IsClickDel) {
        if (this.PageIndex == 1) {
          this.getOrgList();
        }
        else {
          this.PageIndex = 1;
          this.OnSearch();
        }
        this.IsClickDel = false;
      }
    });

    this.getOrgList();

    super.initOtherFuncs();
  }

  ngOnInit() {
    this.initList(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey], this.route.queryParams, "OrgPath", "asc");
  }
  //#endregion
}