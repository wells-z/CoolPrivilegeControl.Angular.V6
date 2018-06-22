import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { Observable } from 'rxjs';

import { LocalStorage, SessionStorage } from 'ngx-webstorage';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

//Components
import { listAnimation } from '../../../cool-privilege-animation';

//Module
import { Error } from '../../../models/common/error';
import { OperationResponse } from '../../../models/common/operation-response';
import { ResponseStatus } from '../../../models/common/response-status';
import { SelectedFuncDetail } from "../../../models/relativevm/selected-func-detail";
import { SelectedFuncType } from "../../../models/relativevm/selected-func-type";
import { FuncVm } from "../../../models/func-vm";
import { FuncTypeVm } from "../../../models/func-type-vm";
import { SelectedSpecificFunc } from "../../../models/uivm/selected-specific-func";
import { SelectedSpecificFuncType } from "../../../models/uivm/selected-specific-func-type";

//Service
import { FuncMgtService } from "../../../services/func-mgt.service";
import { FuncTypeMgtService } from "../../../services/func-type-mgt.service";
import { RoutingHistoryService } from "../../../services/routing-history.service";
import { LoginService } from '../../../services/login.service';
import { LoadingDialogService } from '../../../services/loading-dialog.service';
import { MsgDialogService } from '../../../services/msg-dialog.service';
import { PrivilegeService } from "../../../services/privilege.service";
import { PrivilegeCheckService } from "../../../services/privilege-check.service";

@Component({
  selector: 'cpc-selected-funcs',
  templateUrl: './selected-funcs.component.html',
  styleUrls: ['./selected-funcs.component.css'],
  animations: [listAnimation()]
})
export class SelectedFuncsComponent implements OnInit, OnChanges {

  @Input() pagesize: number;
  @Input() displaypagecount: number;
  @Input() LangKey: string;
  @Input() LangPack: any;
  //#region [ Output FuncDetail List ]
  @Input() OutFuncDetailList: SelectedFuncDetail[];
  //#endregion
  @Output() UpdateFuncDetailList = new EventEmitter<SelectedFuncDetail[]>();

  //#region [ Display Selected Functions ]
  public DisplayFuncList: SelectedSpecificFunc[];
  //#endregion

  //#region [ Display Selected Functions With Paging ]
  public DisplayFuncList_Paging: SelectedSpecificFunc[];
  //#endregion

  //#region [ Function List -- Combo box. ]
  public FuncVMInsts: FuncVm[] = [];
  //#endregion

  //#region [ Function Type List -- Combo box. ]
  public FuncTypeVMInsts: FuncTypeVm[] = [];
  //#endregion

  //#region [ Selected Function ]
  public FuncVMInst: FuncVm;
  //#endregion

  //#region [ Function Type List -- When another function is selected, this list will be refreshed. ]
  public Func_FuncTypeList: SelectedFuncType[];
  //#endregion

  public IsAdd: boolean;

  public IsEdit: boolean;

  public pageindex: number = 1;

  public totalcount: number = 0;

  public SearchCriteria = {
    FuncKey: "",
    FuncTypeKey: ""
  };

  constructor(protected loadingDialogSer: LoadingDialogService, protected msgDialogService: MsgDialogService, protected funcSer: FuncMgtService, protected funcTypeSer: FuncTypeMgtService, protected loginSer: LoginService, public routingHistorySer: RoutingHistoryService, protected pirvilegeCheckSer: PrivilegeCheckService, protected privilegeComponentSer: PrivilegeService) {

  }

  //#region [ Assign Function && Function Type ]
  OnSelFuncID(funcId: string) {
    // console.log(funcId);
    this.Func_FuncTypeList = [];

    if (this.FuncVMInst != null && this.FuncVMInst.SelectedFucTypeList != null) {
      let selFuncTypes_Temp = this.FuncVMInst.SelectedFucTypeList.filter(selFuncType => {
        return selFuncType.Selected == true;
      });

      for (let item of selFuncTypes_Temp) {
        let item_Created = new SelectedFuncType();
        item_Created.FuncTypeID = item.FuncTypeID;
        item_Created.FuncTypeKey = item.FuncTypeKey;
        item_Created.FuncDetailID = item.FuncDetailID;
        item_Created.FuncDetailPri = item.FuncDetailPri;
        item_Created.Selected = false;

        this.Func_FuncTypeList.push(item_Created);
      }
    }

    if (this.Func_FuncTypeList.length == 0) {
      let responseStatus = new ResponseStatus();
      responseStatus.ErrorCode = "01";
      //Function contains sub-function. It doesn't have any function types.
      responseStatus.Message = this.LangPack.hasOwnProperty("E038") ? this.LangPack.E038 : "Function contains sub-function. It doesn't have any function types.";
      let optResp = new OperationResponse(null, '', responseStatus);

      this.FuncVMInst = null;
      this.Func_FuncTypeList = [];

      this.msgDialogService.OpenDialog(optResp);
    }
  }

  OnCancel() {
    this.IsAdd = false;
    this.IsEdit = false;
    this.FuncVMInst = null;
    this.Func_FuncTypeList = [];
  }

  removeItemFromFuncDetailList(funcID: string) {
    this.OutFuncDetailList.forEach((item, index) => {
      if (item.FuncID === funcID) this.OutFuncDetailList.splice(index, 1);
    });

    let temp = this.OutFuncDetailList.filter(selFuncDetail => selFuncDetail.FuncID == funcID);
    if (temp != null && temp.length > 0) {
      this.removeItemFromFuncDetailList(funcID);
    }
  }

  OnSave() {
    this.IsAdd = false;
    this.IsEdit = false;
    if (this.FuncVMInst != null && this.Func_FuncTypeList != null) {
      this.removeItemFromFuncDetailList(this.FuncVMInst.ID);

      let selFuncTypes = this.Func_FuncTypeList.filter(selFuncType => {
        return selFuncType.Selected == true;
      });

      if (selFuncTypes != null && selFuncTypes.length > 0) {
        if (this.OutFuncDetailList == null) {
          this.OutFuncDetailList = [];
        }

        for (let item of selFuncTypes) {
          let selFuncDetail_Temp = new SelectedFuncDetail();
          selFuncDetail_Temp.FuncID = this.FuncVMInst.ID;
          selFuncDetail_Temp.FuncKey = this.FuncVMInst.FuncKey;
          selFuncDetail_Temp.FuncPath = this.FuncVMInst.FuncPath;
          selFuncDetail_Temp.FuncDetailID = item.FuncDetailID;
          selFuncDetail_Temp.FuncTypeID = item.FuncTypeID;
          selFuncDetail_Temp.FuncTypeKey = item.FuncTypeKey;
          selFuncDetail_Temp.Priority = item.FuncDetailPri;

          this.OutFuncDetailList.push(selFuncDetail_Temp);
        }

        this.loadComponent();

        this.UpdateFuncDetailList.emit(this.OutFuncDetailList);
      }
      else {
        let responseStatus = new ResponseStatus();
        responseStatus.ErrorCode = "01";

        let strMsg = "Please check at least one function type."
        if (this.LangPack.hasOwnProperty("E039") && this.LangPack.hasOwnProperty("FunctionType")) {
          //Please check at least one {0}
          strMsg = this.LangPack["E039"].replace("{0}", this.LangPack["FunctionType"]);
        }

        responseStatus.Message = strMsg;
        let optResp = new OperationResponse(null, '', responseStatus);

        this.FuncVMInst = null;
        this.Func_FuncTypeList = [];

        this.msgDialogService.OpenDialog(optResp);
      }
    }
    else {
      let responseStatus = new ResponseStatus();
      responseStatus.ErrorCode = "01";

      let strMsg = "Please Select Function."
      if (this.LangPack.hasOwnProperty("E032") && this.LangPack.hasOwnProperty("FuncKey")) {
        //Please Select {0}.
        strMsg = this.LangPack["E032"].replace("{0}", this.LangPack["FuncKey"]);
      }

      responseStatus.Message = strMsg;
      let optResp = new OperationResponse(null, '', responseStatus);

      this.FuncVMInst = null;
      this.Func_FuncTypeList = [];

      this.msgDialogService.OpenDialog(optResp);
    }

    this.FuncVMInst = null;
    this.Func_FuncTypeList = [];
  }
  //#endregion

  //#region [ Event -- Clear ]
  OnClear() {
    this.SearchCriteria.FuncKey = "";
    this.SearchCriteria.FuncTypeKey = "";
    this.OnSearch();
  }
  //#endregion

  //#region [ Event -- Search ]
  OnSearch() {
    this.pageindex = 1;
    this.DisplayFuncList = [];

    if (this.OutFuncDetailList != null && this.OutFuncDetailList.length > 0) {

      let funcIDList: string[] = []
      for (let selFuncDetail of this.OutFuncDetailList) {
        if (funcIDList.indexOf(selFuncDetail.FuncID) < 0) {
          funcIDList.push(selFuncDetail.FuncID);
        }
      }

      for (let funcID of funcIDList) {
        let isExist = false;

        let selSpecificFuncDetailList = this.OutFuncDetailList.filter(selFunc => selFunc.FuncID == funcID);

        if (this.SearchCriteria.FuncKey != null && this.SearchCriteria.FuncKey != "") {
          selSpecificFuncDetailList = selSpecificFuncDetailList.filter(selFunc => selFunc.FuncID == funcID && selFunc.FuncKey == this.SearchCriteria.FuncKey);
        }

        if (selSpecificFuncDetailList != null && selSpecificFuncDetailList.length > 0) {
          isExist = true;
        }
        else {
          isExist = false;
        }

        if (this.SearchCriteria.FuncTypeKey != null && this.SearchCriteria.FuncTypeKey != "") {
          let selFuncTypeList = selSpecificFuncDetailList.filter(selFunc => selFunc.FuncTypeKey == this.SearchCriteria.FuncTypeKey);

          if (selFuncTypeList != null && selFuncTypeList.length > 0) {
            isExist = true;
          }
          else {
            isExist = false;
          }
        }

        if ((this.SearchCriteria.FuncTypeKey == null || this.SearchCriteria.FuncTypeKey == "") && (this.SearchCriteria.FuncKey == null || this.SearchCriteria.FuncKey == "")) {
          isExist = true;
        }

        if (isExist) {
          let selSpecificFunc_new = new SelectedSpecificFunc();
          selSpecificFunc_new.FuncKey = selSpecificFuncDetailList[0].FuncKey;
          selSpecificFunc_new.FuncName = this.LangPack.hasOwnProperty(selSpecificFuncDetailList[0].FuncKey) ? this.LangPack[selSpecificFuncDetailList[0].FuncKey] : selSpecificFuncDetailList[0].FuncKey;
          selSpecificFunc_new.FuncPath = selSpecificFuncDetailList[0].FuncPath;
          selSpecificFunc_new.FuncID = selSpecificFuncDetailList[0].FuncID;
          selSpecificFunc_new.FuncTypeList = [];
          for (let selSpecificFuncDetail of selSpecificFuncDetailList) {
            let selSpecificFuncType = new SelectedSpecificFuncType();
            selSpecificFuncType.FuncDetailID = selSpecificFuncDetail.FuncDetailID;
            selSpecificFuncType.FuncTypeID = selSpecificFuncDetail.FuncTypeID;
            selSpecificFuncType.FuncTypeKey = selSpecificFuncDetail.FuncTypeKey;
            selSpecificFunc_new.FuncTypeList.push(selSpecificFuncType);
          }
          this.DisplayFuncList.push(selSpecificFunc_new);
        }
      }
      this.totalcount = this.DisplayFuncList.length;
    }

    this.displayFuncListWithPaging(this.pageindex);
  }
  //#endregion

  //#region [ Event -- Add ]
  OnCreate() {
    this.IsAdd = true;
  }
  //#endregion

  //#region [ Event -- Delete ]
  OnDel(selSpecificFunc: SelectedSpecificFunc) {
    let indexOfSelFunc = this.DisplayFuncList.indexOf(selSpecificFunc);
    if (indexOfSelFunc > -1) {
      this.SearchCriteria.FuncTypeKey = "";
      this.SearchCriteria.FuncKey = "";

      this.DisplayFuncList = this.DisplayFuncList.splice(indexOfSelFunc, 1);

      this.removeItemFromFuncDetailList(selSpecificFunc.FuncID);
    }

    this.loadComponent();

    this.UpdateFuncDetailList.emit(this.OutFuncDetailList);
  }
  //#endregion

  //#region [ Event -- Page Change ]
  OnPageChange(PGIndex: number) {
    this.displayFuncListWithPaging(PGIndex);
  }
  //#endregion

  //#region [ Event -- Edit ]
  OnEdit(selSpecificFunc: SelectedSpecificFunc) {
    this.IsEdit = true;

    let funcVMs = this.FuncVMInsts.filter(funcVM => {
      return funcVM.ID == selSpecificFunc.FuncID;
    });

    if (funcVMs != null && funcVMs.length > 0) {
      this.FuncVMInst = funcVMs[0];
    }
    else {
      this.FuncVMInst = null;
    }

    this.Func_FuncTypeList = [];

    if (this.FuncVMInst != null && this.FuncVMInst.SelectedFucTypeList != null) {
      let selFuncTypes_Temp = this.FuncVMInst.SelectedFucTypeList.filter(selFuncType => {
        return selFuncType.Selected == true;
      });

      for (let item of selFuncTypes_Temp) {
        let item_Created = new SelectedFuncType();
        item_Created.FuncTypeID = item.FuncTypeID;
        item_Created.FuncTypeKey = item.FuncTypeKey;
        item_Created.FuncDetailID = item.FuncDetailID;
        item_Created.FuncDetailPri = item.FuncDetailPri;

        item_Created.Selected = false;
        if (selSpecificFunc.FuncTypeList != null && selSpecificFunc.FuncTypeList.length > 0) {
          let funcTypes = selSpecificFunc.FuncTypeList.filter(selFuncType => selFuncType.FuncTypeID == item.FuncTypeID);

          if (funcTypes != null && funcTypes.length > 0) {
            item_Created.Selected = true;
          }
        }

        this.Func_FuncTypeList.push(item_Created);
      }
    }
  }
  //#endregion

  //#region [ Display Function List With Paging ]
  displayFuncListWithPaging(pageindex: number) {

    let pageCount = this.getPageCount(this.DisplayFuncList.length, this.pagesize);
    if (pageCount < pageindex) {
      pageindex = pageCount;
    }
    else {
      pageindex = pageindex;
    }
    this.pageindex = pageindex;
    let index = 0;
    this.DisplayFuncList_Paging = [];
    for (let item_Func of this.DisplayFuncList) {
      if (index >= ((pageindex - 1) * this.pagesize) && index < (pageindex * this.pagesize)) {
        this.DisplayFuncList_Paging.push(item_Func);
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
    this.DisplayFuncList = [];

    if (this.OutFuncDetailList != null && this.OutFuncDetailList.length > 0) {

      let funcIDList: string[] = []
      for (let selFuncDetail of this.OutFuncDetailList) {
        if (funcIDList.indexOf(selFuncDetail.FuncID) < 0) {
          funcIDList.push(selFuncDetail.FuncID);
        }
      }

      for (let funcID of funcIDList) {
        let selSpecificFuncDetailList = this.OutFuncDetailList.filter(selFunc => selFunc.FuncID == funcID);

        if (selSpecificFuncDetailList != null && selSpecificFuncDetailList.length > 0) {
          let selSpecificFunc_new = new SelectedSpecificFunc();
          selSpecificFunc_new.FuncKey = selSpecificFuncDetailList[0].FuncKey;
          selSpecificFunc_new.FuncName = this.LangPack.hasOwnProperty(selSpecificFuncDetailList[0].FuncKey) ? this.LangPack[selSpecificFuncDetailList[0].FuncKey] : selSpecificFuncDetailList[0].FuncKey;
          selSpecificFunc_new.FuncPath = selSpecificFuncDetailList[0].FuncPath;
          selSpecificFunc_new.FuncID = selSpecificFuncDetailList[0].FuncID;
          selSpecificFunc_new.FuncTypeList = [];
          for (let selSpecificFuncDetail of selSpecificFuncDetailList) {
            let selSpecificFuncType = new SelectedSpecificFuncType();
            selSpecificFuncType.FuncDetailID = selSpecificFuncDetail.FuncDetailID;
            selSpecificFuncType.FuncTypeID = selSpecificFuncDetail.FuncTypeID;
            selSpecificFuncType.FuncTypeKey = selSpecificFuncDetail.FuncTypeKey;
            selSpecificFunc_new.FuncTypeList.push(selSpecificFuncType);
          }
          this.DisplayFuncList.push(selSpecificFunc_new);
        }
      }
    }
    this.pageindex = 1;
    this.totalcount = this.DisplayFuncList.length;
    this.displayFuncListWithPaging(this.pageindex);
  }
  //#endregion

  //#region [ Initialize Event ]
  ngOnInit() {
    //#region [ Get Function List ]
    this.funcSer.getAvailableFuncList(true, this.LangKey).subscribe(
      resp => {
        if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
          if (resp.Inst != null) {
            for (let item of resp.Inst) {
              let funcVM = new FuncVm();
              funcVM.ID = item.ID;
              funcVM.FuncKey = item.FuncKey;
              funcVM.FuncPath = item.FuncPath;
              funcVM.SelectedFucTypeList = item.SelectedFucTypeList;
              this.FuncVMInsts.push(funcVM);
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

    //#region [ Get Function Type List ]
    this.funcTypeSer.getAllFuncTypes(this.LangKey).subscribe(
      resp => {
        if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
          if (resp.Inst != null) {
            for (let item of resp.Inst) {
              let funcTypeVM = new FuncTypeVm();
              funcTypeVM.ID = item.ID;
              funcTypeVM.FuncTypeKey = item.FuncTypeKey;
              this.FuncTypeVMInsts.push(funcTypeVM);
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
    if (this.OutFuncDetailList != null)
      this.loadComponent();
  }
  //#endregion
}