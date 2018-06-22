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
import { CoolPrivilegeSerconfig } from '../../cool-privilege-control/cool-privilege-serconfig';
import { LocalStorage, SessionStorage } from 'ngx-webstorage';

//Model
import { OperationResponse } from '../models/common/operation-response'
import { SearchableVm } from "../models/searchable-vm";
import { LuserVm } from "../models/luser-vm";

//Basic Service
import { CommonService } from "./common.service";

@Injectable({
  providedIn: 'root'
})
export class LuserMgtService extends CommonService {

  constructor(private http: HttpClient, injector: Injector) {
    super(injector);
  }

  searchLUserList(searchableVM: SearchableVm): any {
    let bodyString = JSON.stringify(searchableVM); // Stringify payload
    return this.http.post<any>(this.serConfig.baseUrl + "LUserMgmt/SearchLUsers", bodyString, this.getReqOptions());
  }

  getLUserByLUserId(langKey: string, luserId: string) {
    let requestPath = this.serConfig.baseUrl + "LUserMgmt/GetLUserByLUserId";

    if (langKey != null && langKey != "") {
      requestPath = requestPath + "?langKey=" + langKey;
    }
    if (luserId != null && luserId != "") {
      requestPath = requestPath + "&luserId=" + luserId;
    }

    return this.http.get<any>(requestPath, this.getReqOptions());
  }

  createLUser(lUserVM: LuserVm) {
    let bodyString = JSON.stringify(lUserVM); // Stringify payload

    return this.http.post<any>(this.serConfig.baseUrl + "LUserMgmt/CreateLUser", bodyString, this.getReqOptions());
  }

  editLUser(lUserVM: LuserVm) {
    let bodyString = JSON.stringify(lUserVM); // Stringify payload

    return this.http.post<any>(this.serConfig.baseUrl + "LUserMgmt/EditLUser", bodyString, this.getReqOptions());
  }

  delLUser(lUserVM: LuserVm) {
    let bodyString = JSON.stringify(lUserVM); // Stringify payload

    return this.http.post<any>(this.serConfig.baseUrl + "LUserMgmt/DelLUser", bodyString, this.getReqOptions());
  }
}
