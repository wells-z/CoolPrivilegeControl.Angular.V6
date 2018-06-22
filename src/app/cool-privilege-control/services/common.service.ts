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
import { COOLPRIVILEGECONFIG } from '../cool-privilege-serconfig-token';
import { LocalStorage, SessionStorage } from 'ngx-webstorage';

//Model
import { LoginUserVm } from '../models/login-user-vm';
import { FuncVm } from "../models/func-vm";
import { OperationResponse } from '../models/common/operation-response'
import { SearchableVm } from "../models/searchable-vm";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  serConfig: CoolPrivilegeSerconfig;

  @LocalStorage()
  AuthKey: string;

  constructor(injector: Injector) {
    this.serConfig = injector.get(COOLPRIVILEGECONFIG);
    // this.serConfig = new CoolPrivilegeSerconfig();
    // this.serConfig.baseUrl = "http://localhost:1622/api/";
  }

  getReqOptions() {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'authorization': this.AuthKey
      })
    };
    return httpOptions;
  }

  getReqOptionsWOAuth() {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return httpOptions;
  }
}
