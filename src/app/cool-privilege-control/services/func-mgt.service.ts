import { Injectable, InjectionToken, Injector } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CoolPrivilegeSerconfig } from '../cool-privilege-serconfig';
import { LocalStorage, SessionStorage } from 'ngx-webstorage';

//Model
import { FuncVm } from "../models/func-vm";
import { OperationResponse } from '../models/common/operation-response'
import { SearchableVm } from "../models/searchable-vm";

import { CommonService } from "./common.service";

@Injectable({
  providedIn: 'root'
})
export class FuncMgtService extends CommonService {

  constructor(private http: HttpClient, injector: Injector) {
    super(injector);
  }

  getMenuItemList(langKey: string) {
    let requestPath = this.serConfig.baseUrl + "FuncMgmt/GetMenus";
    if (langKey != null && langKey != "") {
      requestPath = requestPath + "?langKey=" + langKey;
    }

    return this.http.get<any>(requestPath, this.getReqOptions());
  }

  getAvailableFuncList(isGetAll: boolean, langKey: string) {
    let requestPath = this.serConfig.baseUrl + "FuncMgmt/GetFuncs";
    if (langKey != null && langKey != "") {
      requestPath = requestPath + "?langKey=" + langKey;
    }

    requestPath = requestPath + "&isGetAll=" + (isGetAll ? "true" : "false")

    return this.http.get<any>(requestPath, this.getReqOptions());
  }

  searchFuncList(searchableVM: SearchableVm): any {
    let bodyString = JSON.stringify(searchableVM); // Stringify payload
    return this.http.post<any>(this.serConfig.baseUrl + "FuncMgmt/SearchFuncs", bodyString, this.getReqOptions());
  }

  getMaxFuncPath(langKey: string, funcPath: string) {
    let requestPath = this.serConfig.baseUrl + "FuncMgmt/GetMaxFuncPath";
    if (langKey != null && langKey != "") {
      requestPath = requestPath + "?langKey=" + langKey;
    }

    if (funcPath != null && funcPath != "") {
      requestPath = requestPath + "&funcPath=" + funcPath;
    }

    return this.http.get<any>(requestPath, this.getReqOptions());
  }

  getFuncByFuncId(langKey: string, funcId: string) {
    let requestPath = this.serConfig.baseUrl + "FuncMgmt/GetFuncByFuncId";

    if (langKey != null && langKey != "") {
      requestPath = requestPath + "?langKey=" + langKey;
    }
    if (funcId != null && funcId != "") {
      requestPath = requestPath + "&funcId=" + funcId;
    }

    return this.http.get<any>(requestPath, this.getReqOptions());
  }

  createFunc(funcVM: FuncVm) {
    let bodyString = JSON.stringify(funcVM); // Stringify payload

    return this.http.post<any>(this.serConfig.baseUrl + "FuncMgmt/CreateFunc", bodyString, this.getReqOptions());
  }

  editFunc(funcVM: FuncVm) {
    let bodyString = JSON.stringify(funcVM); // Stringify payload

    return this.http.post<any>(this.serConfig.baseUrl + "FuncMgmt/EditFunc", bodyString, this.getReqOptions());
  }

  delFunc(funcVM: FuncVm) {
    let bodyString = JSON.stringify(funcVM); // Stringify payload

    return this.http.post<any>(this.serConfig.baseUrl + "FuncMgmt/DelFunc", bodyString, this.getReqOptions());
  }
}
