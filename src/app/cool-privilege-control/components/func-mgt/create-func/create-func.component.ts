import { Component, OnInit } from '@angular/core';
// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { DomSanitizer } from '@angular/platform-browser';

// import { LocalStorage, SessionStorage } from 'ngx-webstorage';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
// import { FlexLayoutModule } from "@angular/flex-layout";

//Components
import { CoolComponent } from "../../../components/common/cool-component";

//Models
// import { Error } from '../../models/common/error';
// import { OperationResponse } from '../../models/common/operation-response';
// import { ResponseStatus } from '../../models/common/response-status';
// import { SearchableVm } from "../../models/searchable-vm";
import { FuncVm } from "../../../models/func-vm";
import { FuncTypeVm } from "../../../models/func-type-vm";
import { SelectedFuncType } from "../../../models/relativevm/selected-func-type";
// import { PrivilegeTypeVm } from "../../../models/privilege-type-vm";

//Services
import { FuncMgtService } from "../../../services/func-mgt.service";
import { FuncTypeMgtService } from "../../../services/func-type-mgt.service";
import { RoutingHistoryService } from "../../../services/routing-history.service";
import { LoginService } from "../../../services/login.service";
import { LoadingDialogService } from '../../../services/loading-dialog.service';
import { MsgDialogService } from '../../../services/msg-dialog.service';
import { PrivilegeService } from "../../../services/privilege.service";
import { PrivilegeCheckService } from "../../../services/privilege-check.service";

@Component({
  selector: 'app-create-func',
  templateUrl: './create-func.component.html',
  styleUrls: ['./create-func.component.css']
})
export class CreateFuncComponent  extends CoolComponent implements OnInit {
  FuncVMInsts: any[] = [];

  FuncTypeVMInsts: any[] = [];

  FuncVMInst: FuncVm = new FuncVm();

  FuncStatusLabel: string;

  ParentPath: string;

  isLinear = true;

  isNewParentFunc: boolean = false;

  ParentFuncGroup: FormGroup;
  FuncDetailGroup: FormGroup;

  //#region [ Constructor ]
  constructor(private _formBuilder: FormBuilder, private route: ActivatedRoute, protected router: Router, public funcSer: FuncMgtService, public funcTypeSer: FuncTypeMgtService, public loadingDialogSer: LoadingDialogService, public msgDialogService: MsgDialogService, public loginSer: LoginService, public routingHistorySer: RoutingHistoryService, public privilegeComponentSer: PrivilegeService, public pirvilegeCheckSer: PrivilegeCheckService) {
    super(loginSer, msgDialogService, pirvilegeCheckSer, privilegeComponentSer, router);

    this.FuncKey = "FuncMgt";
    this.FuncListKey = "FuncList";


    this.ParentFuncGroup = new FormGroup({
      isNewParentFuncCheckBox: new FormControl({ value: false, disabled: false }, Validators.required),
      ParentFunctionSelect: new FormControl({ value: '', disabled: false }, Validators.required),
      FuncPathTextBox: new FormControl({ value: '', disabled: true }, Validators.required)
    });


    this.FuncDetailGroup = new FormGroup({
      FuncKey: new FormControl({ value: '', disabled: false }, Validators.required),
      Url: new FormControl({ value: '', disabled: false }),
      StatusRB: new FormControl({ value: 1, disabled: false }, Validators.required)
    });
  }
  //#endregion

  //#region [ Event  -- Back To List ]
  OnBackToList() {
    this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  //#region [ Event -- Change New Parent Function Event ]
  OnChangeNewParentFunc(event: any) {
    this.isNewParentFunc = this.ParentFuncGroup.get('isNewParentFuncCheckBox').value;
    // console.log(this.isNewParentFunc);

    this.FuncVMInst.FuncPath = "";
    this.ParentPath = "";

    if (this.isNewParentFunc) {

      this.ParentFuncGroup.controls.ParentFunctionSelect.disable();

      this.ParentFuncGroup.controls.FuncPathTextBox.enable();
    }
    else {
      this.ParentFuncGroup.controls.ParentFunctionSelect.enable();

      this.ParentFuncGroup.controls.FuncPathTextBox.disable();    
    }
  }
  //#endregion

  //#region [ Event -- Status RadioButton Event ]
  OnChangeStatus(event: any) {
    this.FuncVMInst.Status = this.FuncDetailGroup.get('StatusRB').value;
    if (this.FuncVMInst.Status == 1) {
      this.FuncStatusLabel = this.LangPack.hasOwnProperty('Active') ? this.LangPack['Active'] : 'Active'
    }
    else if (this.FuncVMInst.Status == 2) {
      this.FuncStatusLabel = this.LangPack.hasOwnProperty('InActive') ? this.LangPack['InActive'] : 'InActive'
    }
  }
  //#endregion

  //#region [ Event -- FuncPath Change Event ]
  OnChangeFuncPath() {
    this.FuncVMInst.FuncPath = this.ParentFuncGroup.get('FuncPathTextBox').value;
  }
  //#endregion

  //#region [ Event -- FuncKey Change Event ]
  OnChangeFuncKey() {
    this.FuncVMInst.FuncKey = this.FuncDetailGroup.get('FuncKey').value;
  }
  //#endregion

  //#region [ Event -- Url Change Event ]
  OnChangeUrl() {
    this.FuncVMInst.Url = this.FuncDetailGroup.get('Url').value;
  }
  //#endregion

  //#region [ Event -- Parent Function Selector Event ]
  OnParentFunctionChange(event: any) {
    this.ParentPath = this.ParentFuncGroup.get('ParentFunctionSelect').value;

    this.loadingDialogSer.OpenLoadingDialog();
    this.funcSer.getMaxFuncPath(this.LangKey, this.ParentPath).subscribe(
      resp => {
        if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
          if (resp.Inst != null) {
            this.FuncVMInst.FuncPath = resp.Inst;
            this.ParentFuncGroup.get('FuncPathTextBox').setValue(this.FuncVMInst.FuncPath);
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
  //#endregion

  //#region [ Event -- Save Button Event ]
  OnSave() {
    this.loadingDialogSer.OpenLoadingDialog();
    this.funcSer.createFunc(this.FuncVMInst).subscribe(
      resp => {
        if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {

          this.loadingDialogSer.refreshAuthKey(resp);

          resp.ResponseStatus.Message = this.LangPack.hasOwnProperty('I000') ? this.LangPack['I000'] : 'Save Successfully!';

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
  //#endregion

  //#region [ Event -- Reset Event ]
  OnReset() {
    this.FuncTypeVMInsts = [];
    this.FuncVMInst.SelectedFucTypeList = [];
    //#region [ Get Function Type List ]
    this.funcTypeSer.getAllFuncTypes(this.LangKey).subscribe(
      resp => {
        if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
          if (resp.Inst != null) {
            for (let item of resp.Inst) {
              let funcTypeVM = new FuncTypeVm();
              funcTypeVM.FuncTypeKey = item.FuncTypeKey;
              funcTypeVM.FuncTypeName = item.FuncTypeKey;
              funcTypeVM.Status = item.Status;
              funcTypeVM.Priority = item.Priority;
              funcTypeVM.ID = item.ID;
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

  //#region [ Event -- Function Type Checkbox Event ]
  OnCheckFuncType(event: any, funcType: FuncTypeVm) {
    let isContains = false;
    let index = -1;

    if (this.FuncVMInst.SelectedFucTypeList != null) {
      for (let selectedFuncTypeVM of this.FuncVMInst.SelectedFucTypeList) {
        if (selectedFuncTypeVM.FuncTypeID == funcType.ID) {
          isContains = true;
          index = this.FuncVMInst.SelectedFucTypeList.indexOf(selectedFuncTypeVM);
          break;
        }
        else {
          isContains = false;
        }
      }
    }
    else {
      this.FuncVMInst.SelectedFucTypeList = [];
    }

    if (isContains) {
      this.FuncVMInst.SelectedFucTypeList.splice(index, 1);
    }
    else {
      let selectedFuncType = new SelectedFuncType();
      selectedFuncType.FuncTypeID = funcType.ID;
      selectedFuncType.FuncTypeKey = funcType.FuncTypeKey;
      selectedFuncType.Selected = true;
      this.FuncVMInst.SelectedFucTypeList.push(selectedFuncType)
    }
  }
  //#endregion

  //#region [ Initial Method ]
  ngOnInit() {
    // this.routingHistorySer.loadRouting();
    this.FuncVMInst.Status = 1;

    this.OnChangeStatus(null);

    this.initOtherFuncs();

    this.loadingDialogSer.OpenLoadingDialog();

    this.loadingDialogSer.onLangChangeEvent.subscribe(optResp => {
      this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey]);
    });
    //#endregion

    //#region [ Get Parent Function List ]
    this.funcSer.getAvailableFuncList(false, this.LangKey).subscribe(
      resp => {
        if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
          if (resp.Inst != null) {
            for (let item of resp.Inst) {
              let funcVM = new FuncVm();
              funcVM.FuncKey = item.FuncKey;
              funcVM.FuncPath = item.FuncPath;
              funcVM.Url = item.Url;
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
              funcTypeVM.FuncTypeKey = item.FuncTypeKey;
              funcTypeVM.FuncTypeName = item.FuncTypeKey;
              funcTypeVM.Status = item.Status;
              funcTypeVM.Priority = item.Priority;
              funcTypeVM.ID = item.ID;
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

    //#region [ Msg Box CallBack ]
    this.msgDialogService.onClosedEvent.subscribe((optResp => {
      if (optResp != null && optResp.ResponseStatus != null && optResp.ResponseStatus.ErrorCode == "00") {
        this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey]);
      }
    }));
    //#endregion
  }
  //#endregion
}