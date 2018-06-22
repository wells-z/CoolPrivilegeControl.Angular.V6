import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { Observable } from 'rxjs';

import { LocalStorage, SessionStorage } from 'ngx-webstorage';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { FlexLayoutModule } from "@angular/flex-layout";

//Components
import { listAnimation } from '../../../cool-privilege-animation';


//Model
import { Error } from '../../../models/common/error';
import { OperationResponse } from '../../../models/common/operation-response';
import { ResponseStatus } from '../../../models/common/response-status';
import { SelectedFuncDetail } from "../../../models/relativevm/selected-func-detail";
import { SelectedFuncType } from "../../../models/relativevm/selected-func-type";
import { SelectedOrgDetailAccRole } from "../../../models/relativevm/selected-org-detail-acc-role";

import { RoleVm } from "../../../models/role-vm";

//Service
import { RoleMgtService } from "../../../services/role-mgt.service";
import { RoutingHistoryService } from "../../../services/routing-history.service";
import { LoginService } from "../../../services/login.service";
import { LoadingDialogService } from '../../../services/loading-dialog.service';
import { MsgDialogService } from '../../../services/msg-dialog.service';
import { PrivilegeService } from "../../../services/privilege.service";
import { PrivilegeCheckService } from "../../../services/privilege-check.service";

@Component({
  selector: 'app-selected-roles',
  templateUrl: './selected-roles.component.html',
  styleUrls: ['./selected-roles.component.css'],
  animations: [listAnimation()]
})
export class SelectedRolesComponent implements OnInit, OnChanges {

  @Input() pagesize: number;
  @Input() displaypagecount: number;
  @Input() LangKey: string;
  @Input() LangPack: any;
  //#region [ Output Role List ]
  @Input() OutRoleList: SelectedOrgDetailAccRole[];
  //#endregion
  @Output() UpdateRoleList = new EventEmitter<SelectedOrgDetailAccRole[]>();

  //#region [ Display Selected Role List ]
  public DisplayRoleList: SelectedOrgDetailAccRole[];
  //#endregion

  //#region [ Display Selected Role List With Paging ]
  public DisplayRoleList_Paging: SelectedOrgDetailAccRole[];
  //#endregion

  //#region [ Role List -- Combo box. ]
  public RoleVMInsts: RoleVm[] = [];
  //#endregion

  public RoleVMInst: RoleVm;

  public EditingSelOrgDAccRole: SelectedOrgDetailAccRole;

  public IsAdd: boolean;

  public IsEdit: boolean;

  public pageindex: number = 1;

  public totalcount: number = 0;

  public SearchCriteria = {
    RoleID: "",
  };

  constructor(protected loadingDialogSer: LoadingDialogService, protected msgDialogService: MsgDialogService, protected roleSer: RoleMgtService, protected loginSer: LoginService, public routingHistorySer: RoutingHistoryService, protected pirvilegeCheckSer: PrivilegeCheckService, protected privilegeComponentSer: PrivilegeService) {

  }

  //#region [ Assign Role ]
  OnCancel() {
    this.IsAdd = false;
    this.IsEdit = false;
    this.EditingSelOrgDAccRole = null;
  }

  OnSave() {

    if (this.IsAdd) {
      let selOrgDAccRole = new SelectedOrgDetailAccRole();

      if (this.RoleVMInst != null) {
        if (this.OutRoleList != null && this.OutRoleList.length > 0) {
          let selOrgDAccRoles = this.OutRoleList.filter(item => {
            return item.RoleID == this.RoleVMInst.ID
          });
          if (selOrgDAccRoles != null && selOrgDAccRoles.length > 0) {
            let responseStatus = new ResponseStatus();
            responseStatus.ErrorCode = "01";

            let strMsg = "Role has already been selected."
            if (this.LangPack.hasOwnProperty("E040") && this.LangPack.hasOwnProperty("E040")) {
              //Role has already been selected
              strMsg = this.LangPack["E040"].replace("{0}", this.LangPack["Role"] + ":" + this.RoleVMInst.RoleKey);
            }

            responseStatus.Message = strMsg;
            let optResp = new OperationResponse(null, '', responseStatus);

            this.msgDialogService.OpenDialog(optResp);

            return;
          }
        }
        selOrgDAccRole.RoleID = this.RoleVMInst.ID;
        selOrgDAccRole.RoleKey = this.RoleVMInst.RoleKey;
        selOrgDAccRole.Selected = true;
      }
      else {
        let responseStatus = new ResponseStatus();
        responseStatus.ErrorCode = "01";

        let strMsg = "Please check at least one role."
        if (this.LangPack.hasOwnProperty("E039") && this.LangPack.hasOwnProperty("Role")) {
          //Please check at least one {0}
          strMsg = this.LangPack["E039"].replace("{0}", this.LangPack["Role"]);
        }

        responseStatus.Message = strMsg;
        let optResp = new OperationResponse(null, '', responseStatus);

        this.msgDialogService.OpenDialog(optResp);

        return;
      }

      if (this.OutRoleList == null) {
        this.OutRoleList = [];
      }
      this.OutRoleList.push(selOrgDAccRole);
    }

    if (this.IsEdit) {
      if (this.EditingSelOrgDAccRole.RoleID != this.RoleVMInst.ID) {
        let indexOfSelFunc = this.OutRoleList.indexOf(this.EditingSelOrgDAccRole);
        if (indexOfSelFunc > -1) {
          this.SearchCriteria.RoleID = "";

          this.OutRoleList.splice(indexOfSelFunc, 1);
        }
      }

      if (this.RoleVMInst != null) {

        if (this.OutRoleList != null && this.OutRoleList.length > 0) {
          let selOrgDAccRoles = this.OutRoleList.filter(item => {
            return item.RoleID == this.RoleVMInst.ID
          });
          if (selOrgDAccRoles != null && selOrgDAccRoles.length > 0) {
            let responseStatus = new ResponseStatus();
            responseStatus.ErrorCode = "01";

            let strMsg = "Role has already been selected."
            if (this.LangPack.hasOwnProperty("E040") && this.LangPack.hasOwnProperty("E040")) {
              //Role has already been selected
              strMsg = this.LangPack["E040"].replace("{0}", this.LangPack["Role"] + ":" + this.RoleVMInst.RoleKey);
            }

            responseStatus.Message = strMsg;
            let optResp = new OperationResponse(null, '', responseStatus);

            this.msgDialogService.OpenDialog(optResp);

            return;
          }
        }

        let selOrgDAccRole = new SelectedOrgDetailAccRole();
        selOrgDAccRole.RoleID = this.RoleVMInst.ID;
        selOrgDAccRole.RoleKey = this.RoleVMInst.RoleKey;
        selOrgDAccRole.Selected = true;

        if (this.OutRoleList == null) {
          this.OutRoleList = [];
        }
        this.OutRoleList.push(selOrgDAccRole);
      }
      else {
        let responseStatus = new ResponseStatus();
        responseStatus.ErrorCode = "01";

        let strMsg = "Please check at least one role."
        if (this.LangPack.hasOwnProperty("E039") && this.LangPack.hasOwnProperty("Role")) {
          //Please check at least one {0}
          strMsg = this.LangPack["E039"].replace("{0}", this.LangPack["Role"]);
        }

        responseStatus.Message = strMsg;
        let optResp = new OperationResponse(null, '', responseStatus);

        this.msgDialogService.OpenDialog(optResp);

        return;
      }
    }

    this.RoleVMInst = null;

    this.DisplayRoleList = this.OutRoleList;

    this.IsAdd = false;
    this.IsEdit = false;
    this.EditingSelOrgDAccRole = null;

    this.loadComponent();

    this.UpdateRoleList.emit(this.OutRoleList);
  }
  //#endregion

  //#region [ Event -- Clear ]
  OnClear() {
    this.SearchCriteria.RoleID = "";
    this.OnSearch();
  }
  //#endregion

  //#region [ Event -- Search ]
  OnSearch() {
    this.pageindex = 1;
    this.DisplayRoleList = [];

    if (this.OutRoleList != null && this.OutRoleList.length > 0) {
      let selOrgDAccRoles = this.OutRoleList;
      if (this.SearchCriteria.RoleID != null && this.SearchCriteria.RoleID != "") {
        selOrgDAccRoles = this.OutRoleList.filter(selOrgDAccRole => {
          return selOrgDAccRole.RoleID == this.SearchCriteria.RoleID
        });
      }

      this.DisplayRoleList = selOrgDAccRoles

      this.totalcount = this.DisplayRoleList.length;
    }

    this.displayRoleListWithPaging(this.pageindex);
  }
  //#endregion

  //#region [ Event -- Add ]
  OnCreate() {
    this.IsAdd = true;
  }
  //#endregion

  //#region [ Event -- Delete ]
  OnDel(selOrgDAccRole: SelectedOrgDetailAccRole) {
    this.SearchCriteria.RoleID = "";
    let indexOfSelFunc = this.OutRoleList.indexOf(selOrgDAccRole);
    // if (indexOfSelFunc > -1) {
    //   this.DisplayRoleList = this.OutRoleList = this.OutRoleList.splice(indexOfSelFunc, 1);
    // }

    this.OutRoleList.forEach((item, index) => {
      if (item.RoleID === selOrgDAccRole.RoleID) this.OutRoleList.splice(index, 1);
    });

    this.DisplayRoleList = this.OutRoleList;

    this.loadComponent();

    this.UpdateRoleList.emit(this.OutRoleList);
  }
  //#endregion

  //#region [ Event -- Page Change ]
  OnPageChange(PGIndex: number) {
    this.displayRoleListWithPaging(PGIndex);
  }
  //#endregion

  //#region [ Event -- Edit ]
  OnEdit(selRole: SelectedOrgDetailAccRole) {
    this.IsEdit = true;

    this.EditingSelOrgDAccRole = selRole;

    if (this.RoleVMInsts != null && this.RoleVMInsts != null) {

      let selRoles = this.RoleVMInsts.filter(roleVM => {
        return roleVM.ID == selRole.RoleID
      });

      if (selRoles != null && selRoles.length > 0) {
        this.RoleVMInst = selRoles[0];
      }
    }
  }
  //#endregion

  //#region [ Display Role List With Paging ]
  displayRoleListWithPaging(pageindex: number) {

    let pageCount = this.getPageCount(this.DisplayRoleList.length, this.pagesize);
    if (pageCount < pageindex) {
      pageindex = pageCount;
    }
    else {
      pageindex = pageindex;
    }
    this.pageindex = pageindex;
    let index = 0;
    this.DisplayRoleList_Paging = [];
    for (let item_Role of this.DisplayRoleList) {
      if (index >= ((pageindex - 1) * this.pagesize) && index < (pageindex * this.pagesize)) {
        this.DisplayRoleList_Paging.push(item_Role);
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
    this.DisplayRoleList = [];
    if (this.OutRoleList != null && this.OutRoleList.length > 0) {
      this.DisplayRoleList = this.OutRoleList;
    }
    this.totalcount = this.DisplayRoleList.length;
    this.pageindex = 1;
    this.displayRoleListWithPaging(this.pageindex);
  }
  //#endregion

  //#region [ Initialize Event ]
  ngOnInit() {
    this.loadingDialogSer.OpenLoadingDialog();
    //#region [ Get Role List ]
    this.roleSer.getAvailableRoleList(this.LangKey).subscribe(
      resp => {
        if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
          if (resp.Inst != null) {
            for (let item of resp.Inst) {
              let roleVM = new RoleVm();
              roleVM.ID = item.ID;
              roleVM.RoleKey = item.RoleKey;
              this.RoleVMInsts.push(roleVM);
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
    if (this.OutRoleList != null)
      this.loadComponent();
  }
  //#endregion
}