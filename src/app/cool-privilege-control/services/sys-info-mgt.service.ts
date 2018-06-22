import { Injectable, InjectionToken, Injector } from '@angular/core';
// import { Http, Response, Headers, RequestOptions } from '@angular/http';
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
import { SysInfoVm } from "../models/sys-info-vm";

//Basic Service
import { CommonService } from "./common.service";

@Injectable({
  providedIn: 'root'
})
export class SysInfoMgtService extends CommonService {

  constructor(private http: HttpClient, injector: Injector) {
    super(injector);
  }

  retrieveSysInfo(): any {
    return this.http.get<any>(this.serConfig.baseUrl + "SysMgmt/RetrieveSystemInfo", this.getReqOptions());
  }

  editSysInfo(sysInfoVM: SysInfoVm) {
    let bodyString = JSON.stringify(sysInfoVM); // Stringify payload

    return this.http.post<any>(this.serConfig.baseUrl + "SysMgmt/UpdateSystemInfo", bodyString, this.getReqOptions());
  }

}