import { Injectable, InjectionToken, Injector } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CoolPrivilegeSerconfig } from '../../cool-privilege-control/cool-privilege-serconfig';
import { LocalStorage, SessionStorage } from 'ngx-webstorage';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

//Model
import { OperationResponse } from '../models/common/operation-response'
import { SearchableVm } from "../models/searchable-vm";
import { OrgDetailVm } from "../models/org-detail-vm";

//Basic Service
import { CommonService } from "./common.service";

@Injectable({
  providedIn: 'root'
})
export class OrgDmgtService extends CommonService {

  constructor(private http: HttpClient, injector: Injector) {
    super(injector);
  }

  searchOrgDList(searchableVM: SearchableVm): any {
    let bodyString = JSON.stringify(searchableVM); // Stringify payload
    return this.http.post<any>(this.serConfig.baseUrl + "OrgDMgmt/SearchOrgDs", bodyString, this.getReqOptions());
  }

  getOrgDByOrgDId(langKey: string, orgDId: string) {
    let requestPath = this.serConfig.baseUrl + "OrgDMgmt/GetOrgDByOrgDId";

    if (langKey != null && langKey != "") {
      requestPath = requestPath + "?langKey=" + langKey;
    }
    if (orgDId != null && orgDId != "") {
      requestPath = requestPath + "&orgDId=" + orgDId;
    }

    return this.http.get<any>(requestPath, this.getReqOptions());
  }

  createOrgD(orgDVM: OrgDetailVm) {
    let bodyString = JSON.stringify(orgDVM); // Stringify payload

    return this.http.post<any>(this.serConfig.baseUrl + "OrgDMgmt/CreateOrgD", bodyString, this.getReqOptions());
  }

  editOrgD(orgDVM: OrgDetailVm) {
    let bodyString = JSON.stringify(orgDVM); // Stringify payload

    return this.http.post<any>(this.serConfig.baseUrl + "OrgDMgmt/EditOrgD", bodyString, this.getReqOptions());
  }

  delOrgD(orgDVM: OrgDetailVm) {
    let bodyString = JSON.stringify(orgDVM); // Stringify payload

    return this.http.post<any>(this.serConfig.baseUrl + "OrgDMgmt/DelOrgD", bodyString, this.getReqOptions());
  }

  getOrgDs(langKey: string)
  {
    let requestPath = this.serConfig.baseUrl + "OrgDMgmt/GetOrgDs";

    if (langKey != null && langKey != "") {
      requestPath = requestPath + "?langKey=" + langKey;
    }

    return this.http.get<any>(requestPath, this.getReqOptions());
  }
}