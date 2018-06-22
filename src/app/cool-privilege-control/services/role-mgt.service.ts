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
import { RoleVm } from "../models/role-vm";

//Basic Service
import { CommonService } from "./common.service";

@Injectable({
  providedIn: 'root'
})
export class RoleMgtService  extends CommonService {

  constructor(private http: HttpClient, injector: Injector) {
    super(injector);
  }

  getAvailableRoleList(langKey: string) {
    let requestPath = this.serConfig.baseUrl + "RoleMgmt/GetRoles";
    if (langKey != null && langKey != "") {
      requestPath = requestPath + "?langKey=" + langKey;
    }

    return this.http.get<any>(requestPath, this.getReqOptions());
  }

  searchRoleList(searchableVM: SearchableVm): any {
    let bodyString = JSON.stringify(searchableVM); // Stringify payload
    return this.http.post<any>(this.serConfig.baseUrl + "RoleMgmt/SearchRoles", bodyString, this.getReqOptions());
  }

  getRoleByRoleId(langKey: string, roleId: string) {
    let requestPath = this.serConfig.baseUrl + "RoleMgmt/GetRoleByRoleId";

    if (langKey != null && langKey != "") {
      requestPath = requestPath + "?langKey=" + langKey;
    }
    if (roleId != null && roleId != "") {
      requestPath = requestPath + "&roleId=" + roleId;
    }

    return this.http.get<any>(requestPath, this.getReqOptions());
  }

  createRole(roleVM: RoleVm) {
    let bodyString = JSON.stringify(roleVM); // Stringify payload

    return this.http.post<any>(this.serConfig.baseUrl + "RoleMgmt/CreateRole", bodyString, this.getReqOptions());
  }

  editRole(roleVM: RoleVm) {
    let bodyString = JSON.stringify(roleVM); // Stringify payload

    return this.http.post<any>(this.serConfig.baseUrl + "RoleMgmt/EditRole", bodyString, this.getReqOptions());
  }

  delRole(roleVM: RoleVm) {
    let bodyString = JSON.stringify(roleVM); // Stringify payload

    return this.http.post<any>(this.serConfig.baseUrl + "RoleMgmt/DelRole", bodyString, this.getReqOptions());
  }
}