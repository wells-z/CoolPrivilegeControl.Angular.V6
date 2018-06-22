import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorage, SessionStorage } from 'ngx-webstorage';

//Module
import { Error } from '../../models/common/error';
import { OperationResponse } from '../../models/common/operation-response';
import { ResponseStatus } from '../../models/common/response-status';
import { SearchableVm } from "../../models/searchable-vm";
import { PrivilegeTypeVm } from "../../models/privilege-type-vm";

// Service
import { PrivilegeCheckService } from "../../services/privilege-check.service";
import { PrivilegeService } from "../../services/privilege.service";
import { MsgDialogService } from '../../services/msg-dialog.service';
import { LoginService } from "../../services/login.service";


export class CoolComponent {
    @LocalStorage()
    LangPack: any;

    @LocalStorage()
    AuthKey: string;

    @LocalStorage()
    public LangKey: string;

    public PageIndex: number;

    public SortColumn: string;

    public SortDir: string;

    public PrivilegeTypeInst: PrivilegeTypeVm = new PrivilegeTypeVm();

    //Paging
    public TotalCount: number = 0;

    public PageSize: number = 5;

    public DisplayPageNum: number = 5;

    public IsClickDel: boolean;

    public FuncKey: string;

    public FuncListKey: string;

    public DateFormat: string;

    public TimeFormat: string;

    public queryParms: Params = {
        PageIndex: 1,
        SortColumn: this.SortColumn,
        SortDir: this.SortDir
    }

    constructor(protected loginSer: LoginService, protected msgDialogService: MsgDialogService, protected pirvilegeCheckSer: PrivilegeCheckService, protected privilegeComponentSer: PrivilegeService, protected router: Router) {
        this.privilegeComponentSer.onGetPrivilegeCallBackEvent.subscribe((PrivilegeTypeInst) => {
            this.PrivilegeTypeInst = PrivilegeTypeInst;
        });
    }

    //#region [ Sort Function ]
    sort(header: string, command: any[]) {
        if (this.SortColumn == header) {
            if (this.SortDir == "asc") {
                this.SortDir = "desc";
            }
            else {
                this.SortDir = "asc";
            }
        }
        else {
            this.SortColumn = header;
            this.SortDir = "asc";
        }
        this.navigateRouter(command);
    }
    //#endregion

    //#region [ Redirect To Another Url ]
    navigateRouter(command: any[]) {
        this.router.navigate(command,
            {
                queryParams: this.queryParms
            });
    }
    //#endregion

    //#region [ Extra method to add the filter params ]
    initSetExtraParam(urlParams: Params) {

    }
    //#endregion

    initOtherFuncs() {
        //#region [ Get System Info. ]
        this.getSystemInfo();
        //#endregion

        //#region [ Get Privilege Inst ]
        this.getPrivilegeInst()
        //#endregion
    }

    initList(command: any[], urlParams: Observable<Params>, defaultSortCol: string, defaultSortDir: string) {
        urlParams.subscribe(params => {
            if (params.hasOwnProperty("PageIndex") && params.hasOwnProperty("SortColumn") && params.hasOwnProperty("SortDir")) {
                if (params.hasOwnProperty("PageIndex")) {
                    let pageIndex = Number(params["PageIndex"]);
                    this.PageIndex = pageIndex;
                }

                if (params.hasOwnProperty("SortColumn")) {
                    let sortColumn = params["SortColumn"];
                    this.SortColumn = sortColumn;
                }

                if (params.hasOwnProperty("SortDir")) {
                    let sortDir = params["SortDir"];
                    this.SortDir = sortDir;
                }

                this.initSetExtraParam(params);

                this.initOtherFuncs();
            }
            else {
                if (params.hasOwnProperty("PageIndex")) {
                    let pageIndex = Number(params["PageIndex"]);
                    this.PageIndex = pageIndex;
                }
                else {
                    this.PageIndex = 1;
                }

                if (params.hasOwnProperty("SortColumn")) {
                    let sortColumn = params["SortColumn"];
                    this.SortColumn = sortColumn;
                }
                else {
                    this.SortColumn = defaultSortCol
                }

                if (params.hasOwnProperty("SortDir")) {
                    let sortDir = params["SortDir"];
                    this.SortDir = sortDir;
                }
                else {
                    this.SortDir = defaultSortDir;
                }

                this.navigateRouter(command);
            }
        });
    }

    //#region [ Get Privilege Instance By Function Key ]
    Callback_getPrivilegeInstByFuncKey(strFuncKey: string, privilegeVM: PrivilegeTypeVm) {
    }

    getPrivilegeInstByFuncKey(strFuncKey: string) {
        if (this.AuthKey != null && this.AuthKey != "") {
            this.pirvilegeCheckSer.getPrivilegeList(this.LangKey, strFuncKey).subscribe(
                resp => {
                    if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
                        if (resp.Inst != null) {
                            let privilegeInst = new PrivilegeTypeVm();
                            for (let item of resp.Inst) {
                                if (item.FuncTypeKey == "View")
                                    privilegeInst.View = true;
                                if (item.FuncTypeKey == "Search")
                                    privilegeInst.Search = true;
                                if (item.FuncTypeKey == "Create")
                                    privilegeInst.Create = true;
                                if (item.FuncTypeKey == "Update")
                                    privilegeInst.Update = true;
                                if (item.FuncTypeKey == "Delete")
                                    privilegeInst.Delete = true;
                                if (item.FuncTypeKey == "Process")
                                    privilegeInst.Process = true;
                                if (item.FuncTypeKey == "Generate")
                                    privilegeInst.Generate = true;
                                if (item.FuncTypeKey == "Import")
                                    privilegeInst.Import = true;
                                if (item.FuncTypeKey == "Export")
                                    privilegeInst.Export = true;
                                if (item.FuncTypeKey == "Login")
                                    privilegeInst.Login = true;
                                if (item.FuncTypeKey == "Logout")
                                    privilegeInst.Logout = true;
                            }
                            this.Callback_getPrivilegeInstByFuncKey(strFuncKey, privilegeInst);
                        }
                    }
                    else if (resp != null) {
                        this.msgDialogService.OpenDialog(resp);
                    }
                },
                err => {
                    this.msgDialogService.OpenFailureDialog(err);
                }
            );
        }
    }
    //#endregion

    //#region [ Get Privilege Info. ]
    getPrivilegeInst() {
        if (this.AuthKey != null && this.AuthKey != "") {
            this.pirvilegeCheckSer.getPrivilegeList(this.LangKey, this.FuncKey).subscribe(
                resp => {
                    if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
                        if (resp.Inst != null) {
                            for (let item of resp.Inst) {
                                if (item.FuncTypeKey == "View")
                                    this.PrivilegeTypeInst.View = true;
                                if (item.FuncTypeKey == "Search")
                                    this.PrivilegeTypeInst.Search = true;
                                if (item.FuncTypeKey == "Create")
                                    this.PrivilegeTypeInst.Create = true;
                                if (item.FuncTypeKey == "Update")
                                    this.PrivilegeTypeInst.Update = true;
                                if (item.FuncTypeKey == "Delete")
                                    this.PrivilegeTypeInst.Delete = true;
                                if (item.FuncTypeKey == "Process")
                                    this.PrivilegeTypeInst.Process = true;
                                if (item.FuncTypeKey == "Generate")
                                    this.PrivilegeTypeInst.Generate = true;
                                if (item.FuncTypeKey == "Import")
                                    this.PrivilegeTypeInst.Import = true;
                                if (item.FuncTypeKey == "Export")
                                    this.PrivilegeTypeInst.Export = true;
                                if (item.FuncTypeKey == "Login")
                                    this.PrivilegeTypeInst.Login = true;
                                if (item.FuncTypeKey == "Logout")
                                    this.PrivilegeTypeInst.Logout = true;
                            }
                            this.privilegeComponentSer.SetPrivilegeValue(this.PrivilegeTypeInst);
                        }
                    }
                    else if (resp != null) {
                        this.msgDialogService.OpenDialog(resp);
                    }
                },
                err => {
                    this.msgDialogService.OpenFailureDialog(err);
                }
            );
        }
    }
    //#endregion

    //#region [ Get System Info. ]
    getSystemInfo() {
        if (this.AuthKey != null && this.AuthKey != "") {
            this.loginSer.getSystemInfo().subscribe(
                resp => {
                    if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
                        if (resp.Inst != null) {
                            this.PageSize = resp.Inst.Sys_PageSize;
                            this.DisplayPageNum = resp.Inst.Sys_DisplayPageNum;
                            this.DateFormat = resp.Inst.Sys_DateFormat;
                            this.TimeFormat = resp.Inst.Sys_TimeFormat;
                        }
                    }
                    else if (resp != null) {
                        this.msgDialogService.OpenDialog(resp);
                    }
                },
                err => {
                    this.msgDialogService.OpenFailureDialog(err);
                }
            );
        }

        this.msgDialogService.onClosedEvent.subscribe(optResp => {

        });
    }
    //#endregion
}
