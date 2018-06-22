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
import { OrgVm } from "../models/org-vm";
import { LuserOrgVm } from "../models/relativevm/luser-org-vm";

//Basic Service
import { CommonService } from "./common.service";

@Injectable({
  providedIn: 'root'
})
export class OrgMgtService extends CommonService {

  constructor(private http: HttpClient, injector: Injector) {
    super(injector);
  }

  getAvailableOrgList(isGetAll: boolean, langKey: string) {
    let requestPath = this.serConfig.baseUrl + "OrgMgmt/GetOrgs";
    if (langKey != null && langKey != "") {
      requestPath = requestPath + "?langKey=" + langKey;
    }

    requestPath = requestPath + "&isGetAll=" + (isGetAll ? "true" : "false")

    return this.http.get<any>(requestPath, this.getReqOptions());
  }

  getSubOrdinateOrgList(langKey:string){
    let requestPath = this.serConfig.baseUrl + "OrgMgmt/GetSubOrdinateOrgs";
    if (langKey != null && langKey != "") {
      requestPath = requestPath + "?langKey=" + langKey;
    }

    return this.http.get<any>(requestPath, this.getReqOptions());
  }

  searchOrgList(searchableVM: SearchableVm): any {
    let bodyString = JSON.stringify(searchableVM); // Stringify payload
    return this.http.post<any>(this.serConfig.baseUrl + "OrgMgmt/SearchOrgs", bodyString, this.getReqOptions());
  }

  getMaxOrgPath(langKey: string, orgPath: string) {
    let requestPath = this.serConfig.baseUrl + "OrgMgmt/GetMaxOrgPath";
    if (langKey != null && langKey != "") {
      requestPath = requestPath + "?langKey=" + langKey;
    }

    if (orgPath != null && orgPath != "") {
      requestPath = requestPath + "&orgPath=" + orgPath;
    }

    return this.http.get<any>(requestPath, this.getReqOptions());
  }

  getOrgByOrgId(langKey: string, orgId: string) {
    let requestPath = this.serConfig.baseUrl + "OrgMgmt/GetOrgByOrgId";

    if (langKey != null && langKey != "") {
      requestPath = requestPath + "?langKey=" + langKey;
    }
    if (orgId != null && orgId != "") {
      requestPath = requestPath + "&orgId=" + orgId;
    }

    return this.http.get<any>(requestPath, this.getReqOptions());
  }

  createOrg(orgVM: OrgVm) {
    let bodyString = JSON.stringify(orgVM); // Stringify payload

    return this.http.post<any>(this.serConfig.baseUrl + "OrgMgmt/CreateOrg", bodyString, this.getReqOptions());
  }

  editOrg(orgVM: OrgVm) {
    let bodyString = JSON.stringify(orgVM); // Stringify payload

    return this.http.post<any>(this.serConfig.baseUrl + "OrgMgmt/EditOrg", bodyString, this.getReqOptions());
  }

  delOrg(orgVM: OrgVm) {
    let bodyString = JSON.stringify(orgVM); // Stringify payload

    return this.http.post<any>(this.serConfig.baseUrl + "OrgMgmt/DelOrg", bodyString, this.getReqOptions());
  }
}