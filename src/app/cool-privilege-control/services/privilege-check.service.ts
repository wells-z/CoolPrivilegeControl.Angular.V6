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
import { LoginUserVm } from '../models/login-user-vm';
import { FuncVm } from "../models/func-vm";
import { OperationResponse } from '../models/common/operation-response'
import { SearchableVm } from "../models/searchable-vm";

import { CommonService } from "../services/common.service";

@Injectable({
  providedIn: 'root'
})
export class PrivilegeCheckService extends CommonService {

  constructor(private http: HttpClient, injector: Injector) {
    super(injector);
  }

  getPrivilegeList(langKey: string, strFunc:string ) {
    let requestPath = this.serConfig.baseUrl + "PrivilegeCheck/GetPrivilegeListByKey";
    if (langKey != null && langKey != "") {
      requestPath = requestPath + "?langKey=" + langKey;
    }

    if(strFunc != null && strFunc != "") {
      requestPath = requestPath + "&strFunc=" + strFunc;
    }

    return this.http.get<any>(requestPath, this.getReqOptions());
  }
}