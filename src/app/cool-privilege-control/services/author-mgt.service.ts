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
import { AuditLogVm } from "../models/audit-log-vm";
import { OperationResponse } from '../models/common/operation-response'
import { SearchableVm } from "../models/searchable-vm";

import { CommonService } from "./common.service";

@Injectable({
  providedIn: 'root'
})
export class AuthorMgtService extends CommonService {

  constructor(private http: HttpClient, injector: Injector) {
    super(injector);
  }

  searchAuthorList(searchableVM: SearchableVm): any {
    let bodyString = JSON.stringify(searchableVM); // Stringify payload
    return this.http.post<any>(this.serConfig.baseUrl + "AuthorMgmt/SearchAuthors", bodyString, this.getReqOptions());
  }

}