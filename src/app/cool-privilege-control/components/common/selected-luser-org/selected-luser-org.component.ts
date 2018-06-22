import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { Observable } from 'rxjs';

import { LocalStorage, SessionStorage } from 'ngx-webstorage';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

//Components
import { listAnimation } from '../../../cool-privilege-animation';

//Model
import { Error } from '../../../Models/Common/error';
import { OperationResponse } from '../../../models/common/operation-response';
import { ResponseStatus } from '../../../models/common/response-status';
import { SelectedFuncDetail } from "../../../models/relativevm/selected-func-detail";
import { SelectedFuncType } from "../../../models/relativevm/selected-func-type";
import { SelectedOrgDetailAccRole } from "../../../models/relativevm/selected-org-detail-acc-role";

import { OrgVm } from "../../../models/org-vm";
import { OrgDetailVm } from "../../../models/org-detail-vm";
import { SelectedLuserOrg } from "../../../models/relativevm/selected-luser-org";

//Service
import { OrgMgtService } from "../../../services/org-mgt.service";
import { OrgDmgtService } from "../../../services/org-dmgt.service";
import { RoutingHistoryService } from "../../../services/routing-history.service";
import { LoginService } from "../../../services/login.service";
import { LoadingDialogService } from '../../../services/loading-dialog.service';
import { MsgDialogService } from '../../../services/msg-dialog.service';
import { PrivilegeService } from "../../../services/privilege.service";
import { PrivilegeCheckService } from "../../../services/privilege-check.service";
import { FuncVm } from '../../../Models/func-vm';

@Component({
  selector: 'cpc-selected-luser-org',
  templateUrl: './selected-luser-org.component.html',
  styleUrls: ['./selected-luser-org.component.css'],
  animations: [listAnimation()]
})
export class SelectedLuserOrgComponent implements OnInit, OnChanges {

  @Input() pagesize: number;
  @Input() displaypagecount: number;
  @Input() LangKey: string;
  @Input() LangPack: any;
  //#region [ Output LUserOrg List ]
  @Input() OutLUserOrgList: SelectedLuserOrg[];
  //#endregion
  @Output() UpdateLUserOrgList = new EventEmitter<SelectedLuserOrg[]>();

  //#region [ Display Selected LUserOrg List ]
  public DisplayLUserOrgList: SelectedLuserOrg[];
  //#endregion

  //#region [ Display Selected LUserOrg List With Paging ]
  public DisplayLUserOrgList_Paging: SelectedLuserOrg[];
  //#endregion

  //#region [ Org List -- Combo box. ]
  public OrgVMInsts: OrgVm[] = [];
  //#endregion

  //#region [ Org Detail List -- Combo box. ]
  public OrgDVMInsts: OrgDetailVm[] = [];
  //#endregion

  public OrgVMInst: OrgVm;

  public OrgDVMInst: OrgDetailVm;

  public EditingSelLUserOrg: SelectedLuserOrg;

  public IsAdd: boolean;

  public IsEdit: boolean;

  public pageindex: number = 1;

  public totalcount: number = 0;

  public SearchCriteria = {
    OrgID: "",
    OrgDID: "",
  };

  constructor(protected loadingDialogSer: LoadingDialogService, protected msgDialogService: MsgDialogService, protected orgSer: OrgMgtService, protected orgDSer: OrgDmgtService, protected loginSer: LoginService, public routingHistorySer: RoutingHistoryService, protected pirvilegeCheckSer: PrivilegeCheckService, protected privilegeComponentSer: PrivilegeService) {

  }

  createRange(number) {
    var items: number[] = [];
    for (var i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }

  //#region [ Assign Role ]
  OnCancel() {
    this.IsAdd = false;
    this.IsEdit = false;
    this.EditingSelLUserOrg = null;
  }

  OnSave() {

    if (this.OrgVMInst == null || this.OrgDVMInst == null) {
      let responseStatus = new ResponseStatus();
      responseStatus.ErrorCode = "01";

      let strMsg = "Please check at least one organization."

      if (this.OrgVMInst == null) {
        if (this.LangPack.hasOwnProperty("E039") && this.LangPack.hasOwnProperty("Org")) {
          //Please check at least one {0}
          strMsg = this.LangPack["E039"].replace("{0}", this.LangPack["Org"]);
        }
      }

      if (this.OrgDVMInst == null) {
        if (this.LangPack.hasOwnProperty("E039") && this.LangPack.hasOwnProperty("OrgD")) {
          //Please check at least one {0}
          strMsg = this.LangPack["E039"].replace("{0}", this.LangPack["OrgD"]);
        }
      }

      responseStatus.Message = strMsg;
      let optResp = new OperationResponse(null, '', responseStatus);

      this.msgDialogService.OpenDialog(optResp);

      return;
    }

    if (this.IsAdd) {
      let selLUserOrgInst = new SelectedLuserOrg();

      selLUserOrgInst.OrgID = this.OrgVMInst.ID;
      selLUserOrgInst.OrgKey = this.OrgVMInst.OrgKey;
      selLUserOrgInst.OrgPath = this.OrgVMInst.OrgPath;
      selLUserOrgInst.OrgDID = this.OrgDVMInst.ID;
      selLUserOrgInst.OrgDetailKey = this.OrgDVMInst.OrgDKey;
      selLUserOrgInst.Selected = true;

      if (this.OutLUserOrgList == null) {
        this.OutLUserOrgList = [];
      }
      this.OutLUserOrgList.push(selLUserOrgInst);
    }

    if (this.IsEdit) {
      if (this.EditingSelLUserOrg.OrgID != this.OrgVMInst.ID || this.EditingSelLUserOrg.OrgDID != this.OrgDVMInst.ID) {
        let indexOfSelFunc = this.OutLUserOrgList.indexOf(this.EditingSelLUserOrg);
        if (indexOfSelFunc > -1) {
          this.SearchCriteria.OrgID = "";
          this.SearchCriteria.OrgDID = "";

          this.OutLUserOrgList.splice(indexOfSelFunc, 1);
        }
      }

      if (this.OrgVMInst != null && this.OrgDVMInst != null) {

        if (this.OutLUserOrgList != null && this.OutLUserOrgList.length > 0) {
          let selOrgDAccRoles = this.OutLUserOrgList.filter(item => {
            return item.OrgID == this.OrgVMInst.ID && item.OrgDID == this.OrgDVMInst.ID
          });
          if (selOrgDAccRoles != null && selOrgDAccRoles.length > 0) {
            let responseStatus = new ResponseStatus();
            responseStatus.ErrorCode = "01";

            let strMsg = "";
            if (this.LangPack.hasOwnProperty("E040") && this.LangPack.hasOwnProperty("E040")) {
              //Organization has already been selected
              strMsg = this.LangPack["E040"].replace("{0}", this.LangPack["Org"] + ":" + this.OrgVMInst.OrgKey);
            }

            if (this.LangPack.hasOwnProperty("E040") && this.LangPack.hasOwnProperty("E040")) {
              //Organization detail has already been selected
              strMsg = this.LangPack["E040"].replace("{0}", this.LangPack["OrgD"] + ":" + this.OrgDVMInst.OrgDKey);
            }

            responseStatus.Message = strMsg;
            let optResp = new OperationResponse(null, '', responseStatus);

            this.msgDialogService.OpenDialog(optResp);

            return;
          }
        }

        let selLUserOrgInst = new SelectedLuserOrg();
        selLUserOrgInst.OrgID = this.OrgVMInst.ID;
        selLUserOrgInst.OrgKey = this.OrgVMInst.OrgKey;
        selLUserOrgInst.OrgPath = this.OrgVMInst.OrgPath;
        selLUserOrgInst.OrgDID = this.OrgDVMInst.ID;
        selLUserOrgInst.OrgDetailKey = this.OrgDVMInst.OrgDKey;
        selLUserOrgInst.Selected = true;

        if (this.OutLUserOrgList == null) {
          this.OutLUserOrgList = [];
        }
        this.OutLUserOrgList.push(selLUserOrgInst);
      }
    }

    this.OrgVMInst = null;
    this.OrgDVMInst = null;

    this.DisplayLUserOrgList = this.OutLUserOrgList;

    this.IsAdd = false;
    this.IsEdit = false;
    this.EditingSelLUserOrg = null;

    this.loadComponent();

    this.UpdateLUserOrgList.emit(this.OutLUserOrgList);
  }
  //#endregion

  //#region [ Event -- Clear ]
  OnClear() {
    this.SearchCriteria.OrgID = "";
    this.SearchCriteria.OrgDID = "";
    this.OnSearch();
  }
  //#endregion

  //#region [ Event -- Search ]
  OnSearch() {
    this.pageindex = 1;
    this.DisplayLUserOrgList = [];

    if (this.OutLUserOrgList != null && this.OutLUserOrgList.length > 0) {
      let selLUserOrgInsts = this.OutLUserOrgList;
      if (this.SearchCriteria.OrgID != null && this.SearchCriteria.OrgDID != "") {
        selLUserOrgInsts = this.OutLUserOrgList.filter(selLUserOrgInst => {
          return selLUserOrgInst.OrgID == this.SearchCriteria.OrgID && selLUserOrgInst.OrgDID == this.SearchCriteria.OrgDID
        });
      }

      this.DisplayLUserOrgList = selLUserOrgInsts;

      this.totalcount = this.DisplayLUserOrgList.length;
    }

    this.displayLUserOrgListWithPaging(this.pageindex);
  }
  //#endregion

  //#region [ Event -- Add ]
  OnCreate() {
    this.IsAdd = true;
  }
  //#endregion

  //#region [ Event -- Delete ]
  OnDel(selLUserOrgInst: SelectedLuserOrg) {
    this.SearchCriteria.OrgID = "";
    this.SearchCriteria.OrgDID = "";
    let indexOfSelFunc = this.OutLUserOrgList.indexOf(selLUserOrgInst);
    // if (indexOfSelFunc > -1) {
    //   this.DisplayRoleList = this.OutRoleList = this.OutRoleList.splice(indexOfSelFunc, 1);
    // }

    this.OutLUserOrgList.forEach((item, index) => {
      if (item.OrgID === selLUserOrgInst.OrgID && item.OrgDID === selLUserOrgInst.OrgDID) this.OutLUserOrgList.splice(index, 1);
    });

    this.DisplayLUserOrgList = this.OutLUserOrgList;

    this.loadComponent();

    this.UpdateLUserOrgList.emit(this.OutLUserOrgList);
  }
  //#endregion

  //#region [ Event -- Page Change ]
  OnPageChange(PGIndex: number) {
    this.displayLUserOrgListWithPaging(PGIndex);
  }
  //#endregion

  //#region [ Event -- Edit ]
  OnEdit(selLUserOrgInst: SelectedLuserOrg) {
    this.IsEdit = true;

    this.EditingSelLUserOrg = selLUserOrgInst;

    if (this.OrgVMInsts != null && this.OrgDVMInsts != null) {

      let selOrgs = this.OrgVMInsts.filter(orgVM => {
        return orgVM.ID == selLUserOrgInst.OrgID
      });

      if (selOrgs != null && selOrgs.length > 0) {
        this.OrgVMInst = selOrgs[0];
      }

      let selOrgDs = this.OrgDVMInsts.filter(orgDVM => {
        return orgDVM.ID == selLUserOrgInst.OrgDID
      });

      if (selOrgDs != null && selOrgDs.length > 0) {
        this.OrgDVMInst = selOrgDs[0];
      }
    }
  }
  //#endregion

  //#region [ Display LUserOrg List With Paging ]
  displayLUserOrgListWithPaging(pageindex: number) {

    let pageCount = this.getPageCount(this.DisplayLUserOrgList.length, this.pagesize);
    if (pageCount < pageindex) {
      pageindex = pageCount;
    }
    else {
      pageindex = pageindex;
    }
    this.pageindex = pageindex;
    let index = 0;
    this.DisplayLUserOrgList_Paging = [];
    for (let item_LUserOrg of this.DisplayLUserOrgList) {
      if (index >= ((pageindex - 1) * this.pagesize) && index < (pageindex * this.pagesize)) {
        this.DisplayLUserOrgList_Paging.push(item_LUserOrg);
      }
      ++index;
    }
  }
  //#endregion

  //#region [ Get Page Count ]
  getPageCount(int_TotalRecord: number, int_PageSize: number) {
    return int_TotalRecord % int_PageSize > 0 ? parseInt((int_TotalRecord / int_PageSize).toString()) + 1 : parseInt((int_TotalRecord / int_PageSize).toString());
  }
  //#endregion

  //#region [ Load Component]
  loadComponent() {
    this.DisplayLUserOrgList = [];
    if (this.OutLUserOrgList != null && this.OutLUserOrgList.length > 0) {
      this.DisplayLUserOrgList = this.OutLUserOrgList;
    }
    this.totalcount = this.DisplayLUserOrgList.length;
    this.pageindex = 1;
    this.displayLUserOrgListWithPaging(this.pageindex);
  }
  //#endregion

  //#region [ Initialize Event ]
  ngOnInit() {
    this.loadingDialogSer.OpenLoadingDialog();
    //#region [ Get Org List ]
    this.orgSer.getSubOrdinateOrgList(this.LangKey).subscribe(
      resp => {
        if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
          if (resp.Inst != null) {
            for (let item of resp.Inst) {
              let orgVM = new OrgVm();
              orgVM.ID = item.ID;
              orgVM.OrgKey = item.OrgKey;
              orgVM.OrgPath = item.OrgPath;
              orgVM.OrgLevls = item.OrgLevls;
              this.OrgVMInsts.push(orgVM);
            }
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
    //#endregion

    //#region [ Get Org Detail List ]
    this.orgDSer.getOrgDs(this.LangKey).subscribe(
      resp => {
        if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
          if (resp.Inst != null) {
            for (let item of resp.Inst) {
              let orgDVM = new OrgDetailVm();
              orgDVM.ID = item.ID;
              orgDVM.OrgDKey = item.OrgDKey;
              this.OrgDVMInsts.push(orgDVM);
            }
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
    //#endregion
  }
  //#endregion

  //#region [ Event -- OnChanges ]
  ngOnChanges(changes: any) {
    if (this.OutLUserOrgList != null)
      this.loadComponent();
  }
  //#endregion
}