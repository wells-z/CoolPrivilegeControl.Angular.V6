import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';

//Component
import { CoolComponent } from "../../../components/common/cool-component";
import { listAnimation } from "../../../cool-privilege-animation";

//Module
import { SearchableVm } from "../../../models/searchable-vm";

//Inner Model
import { SelectedSpecificFunc } from "../../../models/uivm/selected-specific-func";
import { SelectedSpecificFuncType } from "../../../models/uivm/selected-specific-func-type";


//Services
import { RoutingHistoryService } from "../../../services/routing-history.service";
import { PrivilegeCheckService } from "../../../services/privilege-check.service";
import { PrivilegeService } from "../../../services/privilege.service";
import { LoginService } from "../../../services/login.service";
import { LoadingDialogService } from '../../../services/loading-dialog.service';
import { MsgDialogService } from '../../../services/msg-dialog.service';

import { LuserMgtService } from "../../../services/luser-mgt.service";

@Component({
  selector: 'app-luser-list',
  templateUrl: './luser-list.component.html',
  styleUrls: ['./luser-list.component.css'],
  animations: [
    // slideUpDownAnimation(32), // will return trigger named "slideUpDownAnimation32"
    listAnimation()
  ]
})
export class LuserListComponent extends CoolComponent implements OnInit {

  //#region [ Search Criteria ]
  public SearchCriteria = {
    LoginName: "",
    AccessPrivilegeTypeShort: "null",
    Status: "null"
  };
  //#endregion

  //#region [ LUser List ]
  LUserList: any[] = [];
  //#endregion

  //#region [ Constructor ]
  constructor(private route: ActivatedRoute, protected router: Router, private luserSer: LuserMgtService, public loadingDialogSer: LoadingDialogService, protected msgDialogService: MsgDialogService, protected loginSer: LoginService, public routingHistorySer: RoutingHistoryService, protected pirvilegeCheckSer: PrivilegeCheckService, protected privilegeComponentSer: PrivilegeService) {
    super(loginSer, msgDialogService, pirvilegeCheckSer, privilegeComponentSer, router);
    this.FuncKey = "LUserMgt";
    this.FuncListKey = "LUserList";
  }
  //#endregion

  //#region [ Event -- Sort Login User ]
  OnSort(header: string) {
    this.sort(header, ["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  //#region [ Event -- Clear ]
  OnClear() {
    this.SearchCriteria.LoginName = "";
    this.SearchCriteria.AccessPrivilegeTypeShort = "null";
    this.SearchCriteria.Status = "null";
    this.OnSearch();
  }
  //#endregion

  //#region [ Event -- Search Login User ]
  OnSearch() {
    this.PageIndex = 1;
    this.navigateRouter(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  //#region [ Event -- Delete Login User ]
  OnDel(orgId: string) {
    this.IsClickDel = true;
    if (this.AuthKey != null && this.AuthKey != "") {
      this.loadingDialogSer.OpenLoadingDialog();
      this.luserSer.getLUserByLUserId(this.LangKey, orgId).subscribe(
        resp => {
          if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
            if (resp.Inst != null) {
              this.luserSer.delLUser(resp.Inst).subscribe(
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

  //#region [ Event -- Edit Login User ]
  OnEdit(orgDId: string) {
    this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, "EditLUser", orgDId]);
  }
  //#endregion

  //#region [ Event -- Create Login User ]
  OnCreate() {
    this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, "CreateLUser"]);
  }
  //#endregion

  //#region [ Event -- Page Change ]
  OnPageChange(PGIndex: number) {
    this.PageIndex = PGIndex;
    this.navigateRouter(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  getSearchCriteria(): any {
    if (this.SearchCriteria.Status == "null" && this.SearchCriteria.LoginName == "" && this.SearchCriteria.AccessPrivilegeTypeShort == "null") {
      return null;
    }
    else {
      return this.SearchCriteria;
    }
  }

  //#region [ Get Login User List ]
  private getLUserList() {
    //Search Organization
    let searchableVM = new SearchableVm();
    searchableVM.VMInst = this.getSearchCriteria();
    searchableVM.PageIndex = this.PageIndex;
    searchableVM.SortColumn = this.SortColumn;
    searchableVM.SortDir = this.SortDir;
    searchableVM.LangKey = this.LangKey;

    if (this.AuthKey != null && this.AuthKey != "") {
      this.loadingDialogSer.OpenLoadingDialog();
      this.luserSer.searchLUserList(searchableVM).subscribe(
        resp => {
          if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
            if (resp.Inst != null) {
              this.LUserList = resp.Inst;

              //#region [ Get selected function detail list ]
              if (this.LUserList != null && this.LUserList.length > 0) {
                for (let i = 0; i < this.LUserList.length; ++i) {
                  if (this.LUserList[i].SelectedFuncDetailList != null && this.LUserList[i].SelectedFuncDetailList.length > 0) {
                    this.LUserList[i].SelFuncDInfos = [];

                    let funcIDList: string[] = []
                    for (let selFuncDetail of this.LUserList[i].SelectedFuncDetailList) {
                      if (funcIDList.indexOf(selFuncDetail.FuncID) < 0) {
                        funcIDList.push(selFuncDetail.FuncID);
                      }
                    }

                    for (let funcID of funcIDList) {
                      let selSpecificFuncDetailList = this.LUserList[i].SelectedFuncDetailList.filter(selFunc => selFunc.FuncID == funcID);

                      if (selSpecificFuncDetailList != null && selSpecificFuncDetailList.length > 0) {
                        let selSpecificFunc_new = new SelectedSpecificFunc();
                        selSpecificFunc_new.FuncID = selSpecificFuncDetailList[0].FuncID;
                        selSpecificFunc_new.FuncName = this.LangPack.hasOwnProperty(selSpecificFuncDetailList[0].FuncKey) ? this.LangPack[selSpecificFuncDetailList[0].FuncKey] : selSpecificFuncDetailList[0].FuncKey;
                        selSpecificFunc_new.FuncTypeList = [];
                        for (let selSpecificFuncDetail of selSpecificFuncDetailList) {
                          let selSpecificFuncType = new SelectedSpecificFuncType();
                          selSpecificFuncType.FuncTypeID = selSpecificFuncDetail.FuncTypeID;
                          selSpecificFuncType.FuncTypeKey = selSpecificFuncDetail.FuncTypeKey;
                          selSpecificFunc_new.FuncTypeList.push(selSpecificFuncType);
                        }
                        this.LUserList[i].SelFuncDInfos.push(selSpecificFunc_new);
                      }
                    }
                  }
                }
              }
              //#endregion
            }
            this.TotalCount = resp.RecordCount;

            this.loadingDialogSer.refreshAuthKey(resp);
          }
          else if (resp != null) {
            this.TotalCount = 0;
            this.PageIndex = 1;
            this.loadingDialogSer.refreshAuthKey(resp);
            this.LUserList = [];

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
      LoginName: this.SearchCriteria.LoginName,
      AccessPrivilegeTypeShort: this.SearchCriteria.AccessPrivilegeTypeShort,
      Status: this.SearchCriteria.Status,
    }
    super.navigateRouter(command);
  }
  //#endregion

  //#region [ Initialize Event ]
  initSetExtraParam(urlParams: Params) {
    if (urlParams.hasOwnProperty("LoginName")) {
      let loginName = urlParams["LoginName"];
      this.SearchCriteria.LoginName = loginName;
    }
    else {
      this.SearchCriteria.LoginName = "";
    }

    if (urlParams.hasOwnProperty("AccessPrivilegeTypeShort")) {
      let accPrivilegeTypeShort = urlParams["AccessPrivilegeTypeShort"];
      this.SearchCriteria.AccessPrivilegeTypeShort = accPrivilegeTypeShort;
    }
    else {
      this.SearchCriteria.AccessPrivilegeTypeShort = "null";
    }

    if (urlParams.hasOwnProperty("Status")) {
      let status = urlParams["Status"];
      this.SearchCriteria.Status = status;
    }
    else {
      this.SearchCriteria.Status = "null";
    }
    super.initSetExtraParam(urlParams);
  }

  initOtherFuncs() {
    this.msgDialogService.onClosedEvent.subscribe(optResp => {
      if (this.IsClickDel) {
        if (this.PageIndex == 1) {
          this.getLUserList();
        }
        else {
          this.PageIndex = 1;
          this.OnSearch();
        }
        this.IsClickDel = false;
      }
    });

    this.getLUserList();

    super.initOtherFuncs();
  }

  ngOnInit() {
    this.initList(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey], this.route.queryParams, "Name", "asc");
  }
  //#endregion
}
