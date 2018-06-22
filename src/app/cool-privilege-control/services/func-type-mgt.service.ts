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
import { FuncTypeVm } from "../models/func-type-vm";
import { OperationResponse } from '../models/common/operation-response'
import { SearchableVm } from "../models/searchable-vm";

import { CommonService } from "./common.service";

@Injectable({
  providedIn: 'root'
})
export class FuncTypeMgtService extends CommonService {

  constructor(private http: HttpClient, injector: Injector) {
    super(injector);
  }

  getAllFuncTypes(langKey: string) {
    let requestPath = this.serConfig.baseUrl + "FuncTypeMgmt/GetAllFuncTypes";

    if (langKey != null && langKey != "") {
      requestPath = requestPath + "?langKey=" + langKey;
    }

    return this.http.get<any>(requestPath, this.getReqOptions());
  }

  searchFuncTypeList(searchableVM: SearchableVm): any {
    let bodyString = JSON.stringify(searchableVM); // Stringify payload
    return this.http.post<any>(this.serConfig.baseUrl + "FuncTypeMgmt/SearchFuncTypes", bodyString, this.getReqOptions());
  }

  getFuncTypeByFuncTypeId(langKey: string, funcTypeId: string) {
    let requestPath = this.serConfig.baseUrl + "FuncTypeMgmt/GetFuncTypeByFuncTypeId";

    if (langKey != null && langKey != "") {
      requestPath = requestPath + "?langKey=" + langKey;
    }
    if (funcTypeId != null && funcTypeId != "") {
      requestPath = requestPath + "&funcTypeId=" + funcTypeId;
    }

    return this.http.get<any>(requestPath, this.getReqOptions());
  }

  createFuncType(funcTypeVM: FuncTypeVm) {
    let bodyString = JSON.stringify(funcTypeVM); // Stringify payload

    return this.http.post<any>(this.serConfig.baseUrl + "FuncTypeMgmt/CreateFuncType", bodyString, this.getReqOptions());
  }

  editFuncType(funcTypeVM: FuncTypeVm) {
    let bodyString = JSON.stringify(funcTypeVM); // Stringify payload

    return this.http.post<any>(this.serConfig.baseUrl + "FuncTypeMgmt/EditFuncType", bodyString, this.getReqOptions());
  }

  delFuncType(funcTypeVM: FuncTypeVm) {
    let bodyString = JSON.stringify(funcTypeVM); // Stringify payload

    return this.http.post<any>(this.serConfig.baseUrl + "FuncTypeMgmt/DelFuncType", bodyString, this.getReqOptions());
  }

  getMaxFuncTypePri(langKey: string) {
    let requestPath = this.serConfig.baseUrl + "FuncTypeMgmt/GetMaxFuncTypePri";

    if (langKey != null && langKey != "") {
      requestPath = requestPath + "?langKey=" + langKey;
    }

    return this.http.get<any>(requestPath, this.getReqOptions());
  }
}
