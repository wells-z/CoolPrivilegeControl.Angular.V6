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

import { OrgDmgtService } from "../../../services/org-dmgt.service";

@Component({
  selector: 'app-org-d-list',
  templateUrl: './org-d-list.component.html',
  styleUrls: ['./org-d-list.component.css'],
  animations: [
    // slideUpDownAnimation(32), // will return trigger named "slideUpDownAnimation32"
    listAnimation()
  ]
})
export class OrgDListComponent  extends CoolComponent implements OnInit {
  //#region [ Search Criteria ]
  public SearchCriteria = {
    OrgDKey: "",
    AccessPrivilegeTypeShort: null,
  };
  //#endregion

  //#region [ Organization Detail List ]
  OrgDList: any[] = [];
  //#endregion

  //#region [ Constructor ]
  constructor(private route: ActivatedRoute, protected router: Router, private orgDSer: OrgDmgtService, public loadingDialogSer: LoadingDialogService, protected msgDialogService: MsgDialogService, protected loginSer: LoginService, public routingHistorySer: RoutingHistoryService, protected pirvilegeCheckSer: PrivilegeCheckService, protected privilegeComponentSer: PrivilegeService) {
    super(loginSer, msgDialogService, pirvilegeCheckSer, privilegeComponentSer, router);
    this.FuncKey = "OrgDMgt";
    this.FuncListKey = "OrgDList";
  }
  //#endregion

  //#region [ Event -- Sort Organization Detail ]
  OnSort(header: string) {
    this.sort(header, ["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  //#region [ Event -- Search Organization Detail ]
  OnSearch() {
    this.PageIndex = 1;
    this.navigateRouter(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  //#region [ Event -- Delete Organization Detail ]
  OnDel(orgDId: string) {
    this.IsClickDel = true;
    this.loadingDialogSer.OpenLoadingDialog();
    this.orgDSer.getOrgDByOrgDId(this.LangKey, orgDId).subscribe(
      resp => {
        if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
          if (resp.Inst != null) {
            this.orgDSer.delOrgD(resp.Inst).subscribe(
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

  //#region [ Event -- Edit Organization Detail ]
  OnEdit(orgDId: string) {
    this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, "EditOrgD", orgDId]);
  }
  //#endregion

  //#region [ Event -- Create Organization Detail ]
  OnCreate() {
    this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, "CreateOrgD"]);
  }
  //#endregion

  //#region [ Event -- Page Change ]
  OnPageChange(PGIndex: number) {
    this.PageIndex = PGIndex;
    this.navigateRouter(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  getSearchCriteria(): any {
    if (this.SearchCriteria.OrgDKey == "" && this.SearchCriteria.AccessPrivilegeTypeShort == null) {
      return null;
    }
    else {
      return this.SearchCriteria;
    }
  }

  //#region [ Get Organization Detail List ]
  private getOrgDList() {
    //Search Organization
    let searchableVM = new SearchableVm();
    searchableVM.VMInst = this.getSearchCriteria();
    searchableVM.PageIndex = this.PageIndex;
    searchableVM.SortColumn = this.SortColumn;
    searchableVM.SortDir = this.SortDir;
    searchableVM.LangKey = this.LangKey;

    if (this.AuthKey != null && this.AuthKey != "") {
      this.loadingDialogSer.OpenLoadingDialog();
      this.orgDSer.searchOrgDList(searchableVM).subscribe(
        resp => {
          if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
            if (resp.Inst != null) {
              this.OrgDList = resp.Inst;
            }
            this.TotalCount = resp.RecordCount;

            this.loadingDialogSer.refreshAuthKey(resp);
          }
          else if (resp != null) {
            this.TotalCount = 0;
            this.PageIndex = 1;
            this.loadingDialogSer.refreshAuthKey(resp);
            this.OrgDList = [];

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

  //#region [ Navigate Router ]
  navigateRouter(command: any[]) {
    this.queryParms = {
      PageIndex: this.PageIndex,
      SortColumn: this.SortColumn,
      SortDir: this.SortDir,
      OrgDKey: this.SearchCriteria.OrgDKey,
      AccessPrivilegeTypeShort: this.SearchCriteria.AccessPrivilegeTypeShort,
    }
    super.navigateRouter(command);
  }
  //#endregion

  //#region [ Initialize Event ]
  initSetExtraParam(urlParams: Params) {
    if (urlParams.hasOwnProperty("OrgDKey")) {
      let orgDKey = urlParams["OrgDKey"];
      this.SearchCriteria.OrgDKey = orgDKey;
    }
    else {
      this.SearchCriteria.OrgDKey = "";
    }

    if (urlParams.hasOwnProperty("AccessPrivilegeTypeShort")) {
      let accPrivilegeTypeShort = urlParams["AccessPrivilegeTypeShort"];
      this.SearchCriteria.AccessPrivilegeTypeShort = accPrivilegeTypeShort;
    }
    else {
      this.SearchCriteria.AccessPrivilegeTypeShort = null;
    }
    super.initSetExtraParam(urlParams);
  }

  initOtherFuncs() {
    this.msgDialogService.onClosedEvent.subscribe(optResp => {
      if (this.IsClickDel) {
        if (this.PageIndex == 1) {
          this.getOrgDList();
        }
        else {
          this.PageIndex = 1;
          this.OnSearch();
        }
        this.IsClickDel = false;
      }
    });

    this.getOrgDList();

    super.initOtherFuncs();
  }

  ngOnInit() {
    this.initList(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey], this.route.queryParams, "OrgDKey", "asc");
  }
  //#endregion
}
