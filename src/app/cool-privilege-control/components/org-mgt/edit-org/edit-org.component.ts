import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';

//Components
import { CoolComponent } from "../../../components/common/cool-component";

//Models
import { OrgVm } from "../../../models/org-vm";

//Services
import { RoutingHistoryService } from "../../../services/routing-history.service";
import { LoginService } from "../../../services/login.service";
import { LoadingDialogService } from '../../../services/loading-dialog.service';
import { MsgDialogService } from '../../../services/msg-dialog.service';
import { PrivilegeService } from "../../../services/privilege.service";
import { PrivilegeCheckService } from "../../../services/privilege-check.service";

import { OrgMgtService } from '../../../services/org-mgt.service';

@Component({
  selector: 'app-edit-org',
  templateUrl: './edit-org.component.html',
  styleUrls: ['./edit-org.component.css']
})
export class EditOrgComponent extends CoolComponent implements OnInit {

  //#region [ Properties ]
  OrgVMInst: OrgVm = new OrgVm();

  orgId: string;
  //#endregion

  //#region [ Constructor ]
  constructor(private route: ActivatedRoute, protected router: Router, private orgSer: OrgMgtService, public loadingDialogSer: LoadingDialogService, protected msgDialogService: MsgDialogService, protected loginSer: LoginService, public routingHistorySer: RoutingHistoryService, protected pirvilegeCheckSer: PrivilegeCheckService, protected privilegeComponentSer: PrivilegeService) {
    super(loginSer, msgDialogService, pirvilegeCheckSer, privilegeComponentSer, router);

    this.FuncKey = "OrgMgt";
    this.FuncListKey = "OrgList";

  }
  //#endregion

  //#region [ Event -- Change New Parent Organization Event ]
  OnChangeNewParentOrg(event: any) {
    this.OrgVMInst.OrgPath = "";
  }
  //#endregion

  //#region [ Initial Method ]
  ngOnInit() {

    this.initOtherFuncs();

    this.msgDialogService.onClosedEvent.subscribe((optResp => {
      if (optResp != null && optResp.ResponseStatus != null && optResp.ResponseStatus.ErrorCode == "00") {
        this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey]);
      }
    }));

    if (this.AuthKey != null && this.AuthKey != "") {

      this.loadingDialogSer.OpenLoadingDialog();

      //#region [ Get Organization By Org Id ]
      this.route.paramMap.subscribe((params: ParamMap) => {
        if (params.has("ID")) {
          this.orgId = params.get("ID");

          this.orgSer.getOrgByOrgId(this.LangKey, this.orgId).subscribe(
            resp => {
              if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
                if (resp.Inst != null) {
                  this.OrgVMInst = resp.Inst;
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
        else {
          this.msgDialogService.OpenFailureDialog({ message: this.LangPack.E003 });
          this.loadingDialogSer.CloseLoadingDialog();
        }
      }
      );
    }
    //#endregion
  }
  //#endregion

  //#region [ Event -- Status RadioButton Event ]
  OnChangeStatus(event: any) {
    // if (this.OrgVMInst.Status == 1) {
    //   this.OrgStatusLabel = this.LangPack.hasOwnProperty('Active') ? this.LangPack['Active'] : 'Active'
    // }
    // else if (this.OrgVMInst.Status == 2) {
    //   this.OrgStatusLabel = this.LangPack.hasOwnProperty('InActive') ? this.LangPack['InActive'] : 'InActive'
    // }
  }
  //#endregion

  //#region [ Event -- Parent Organization Selector Event ]
  OnParentOrgChange(selectedParentPath: string) {
    this.loadingDialogSer.OpenLoadingDialog();
    this.orgSer.getMaxOrgPath(this.LangKey, selectedParentPath).subscribe(
      resp => {
        if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
          if (resp.Inst != null) {
            this.OrgVMInst.OrgPath = resp.Inst;
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

  //#region [ Event  -- Back To List ]
  OnBackToList() {
    this.router.navigate(["/CoolPrivilegeControl", this.LangKey, this.FuncKey, this.FuncListKey]);
  }
  //#endregion

  //#region [ Event -- Save ]
  OnSave() {
    if (this.AuthKey != null && this.AuthKey != "") {
      this.loadingDialogSer.OpenLoadingDialog();
      this.orgSer.editOrg(this.OrgVMInst).subscribe(
        resp => {
          if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {

            this.loadingDialogSer.refreshAuthKey(resp);

            resp.ResponseStatus.Message = this.LangPack.hasOwnProperty('I000') ? this.LangPack['I000'] : 'Save Successfully!';

            this.msgDialogService.OpenDialog(resp);
          }
          else if (resp != null) {
            this.loadingDialogSer.refreshAuthKey(resp);

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
  //#endregion
}
