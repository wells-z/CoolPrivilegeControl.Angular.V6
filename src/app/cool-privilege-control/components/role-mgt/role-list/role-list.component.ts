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

import { RoleMgtService } from "../../../services/role-mgt.service";

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css'],
  animations: [
    // slideUpDownAnimation(32), // will return trigger named "slideUpDownAnimation32"
    listAnimation()
  ]
})
export class RoleListComponent extends CoolComponent implements OnInit {
  //#region [ Search Criteria ]
  public SearchCriteriaRole = {
    RoleKey: ""
  };
  //#endregion

  //#region [ Role List ]
  RoleList: any[] = [];
  //#endregion

  //#region [ Constructor ]
  constructor(private route: ActivatedRoute, protected router: Router, private roleSer: RoleMgtService, public loadingDialogSer: LoadingDialogService, protected msgDialogService: MsgDialogService, protected loginSer: LoginService, public routingHistorySer: RoutingHistoryService, protected pirvilegeCheckSer: PrivilegeCheckService, protected privilegeComponentSer: PrivilegeService) {
    super(loginSer, msgDialogService, pirvilegeCheckSer, privilegeComponentSer, router);
    this.FuncKey = "RoleMgt";
    this.FuncListKey = "RoleList";
  }
  //#endregion

  //#region [ Event -- Sort Function ]
  OnSort(header: string) {
    this.sort(header, ["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  //#region [ Event -- Search Function ]
  OnSearch() {
    this.PageIndex = 1;
    this.navigateRouter(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  //#region [ Event -- Delete Function ]
  OnDel(roleId: string) {
    this.IsClickDel = true;
    if (this.AuthKey != null && this.AuthKey != "") {
      this.loadingDialogSer.OpenLoadingDialog();
      this.roleSer.getRoleByRoleId(this.LangKey, roleId).subscribe(
        resp => {
          if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
            if (resp.Inst != null) {
              this.roleSer.delRole(resp.Inst).subscribe(
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
  }
  //#endregion

  //#region [ Event -- Edit Role ]
  OnEdit(roleId: string) {
    this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, "EditRole", roleId]);
  }
  //#endregion

  //#region [ Event -- Create Role ]
  OnCreate() {
    this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, "CreateRole"]);
  }
  //#endregion

  //#region [ Event -- Page Change ]
  OnPageChange(PGIndex: number) {
    this.PageIndex = PGIndex;
    this.navigateRouter(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  //#region [ Event -- Clear ]
  OnClear() {
    this.SearchCriteriaRole.RoleKey = "";
    this.OnSearch();
  }
  //#endregion

  getSearchCriteria(): any {
    if (this.SearchCriteriaRole.RoleKey == "") {
      return null;
    }
    else {
      return this.SearchCriteriaRole;
    }
  }

  //#region [ Get Role List ]
  private getRoleList() {
    //Search Role
    let searchableVM = new SearchableVm();
    searchableVM.VMInst = this.getSearchCriteria();
    searchableVM.PageIndex = this.PageIndex;
    searchableVM.SortColumn = this.SortColumn;
    searchableVM.SortDir = this.SortDir;
    searchableVM.LangKey = this.LangKey;

    if (this.AuthKey != null && this.AuthKey != "") {
      this.loadingDialogSer.OpenLoadingDialog();
      this.roleSer.searchRoleList(searchableVM).subscribe(
        resp => {
          if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
            if (resp.Inst != null) {
              this.RoleList = resp.Inst;
            }
            this.TotalCount = resp.RecordCount;

            this.loadingDialogSer.refreshAuthKey(resp);
          }
          else if (resp != null) {
            this.TotalCount = 0;
            this.PageIndex = 1;
            this.loadingDialogSer.refreshAuthKey(resp);
            this.RoleList = [];

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
      RoleKey: this.SearchCriteriaRole.RoleKey
    }
    super.navigateRouter(command);
  }
  //#endregion

  //#region [ Initialize Event ]
  initSetExtraParam(urlParams: Params) {
    if (urlParams.hasOwnProperty("RoleKey")) {
      let roleKey = urlParams["RoleKey"];
      this.SearchCriteriaRole.RoleKey = roleKey;
    }
    else {
      this.SearchCriteriaRole.RoleKey = "";
    }
    super.initSetExtraParam(urlParams);
  }

  initOtherFuncs() {
    this.msgDialogService.onClosedEvent.subscribe(optResp => {
      if (this.IsClickDel) {
        if (this.PageIndex == 1) {
          this.getRoleList();
        }
        else {
          this.PageIndex = 1;
          this.OnSearch();
        }
        this.IsClickDel = false;
      }
    });

    this.getRoleList();

    super.initOtherFuncs();
  }

  ngOnInit() {
    this.initList(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey], this.route.queryParams, "RoleKey", "asc");
  }
  //#endregion
}
