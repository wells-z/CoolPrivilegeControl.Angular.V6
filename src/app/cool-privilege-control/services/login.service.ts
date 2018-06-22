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
import { CoolPrivilegeSerconfig } from '../cool-privilege-serconfig';
import { LocalStorage, SessionStorage } from 'ngx-webstorage';
import { LoginUserVm } from '../models/login-user-vm';
import { OperationResponse } from '../models/common/operation-response'

import { CommonService } from "./common.service";

@Injectable({
  providedIn: 'root'
})
export class LoginService extends CommonService {

  serConfig: CoolPrivilegeSerconfig;

  @LocalStorage()
  AuthKey: string;

  constructor(private http: HttpClient, injector: Injector) {
    super(injector);
  }

  refreshAuthKey(resp: any) {
    if (resp != null && resp.CoolJWToken != null) {
      this.AuthKey = resp.CoolJWToken;
    }
  }

  login(loginInfo: LoginUserVm) {
    let bodyString = JSON.stringify(loginInfo); // Stringify payload
    return this.http.post<any>(this.serConfig.baseUrl + "Login/Login", bodyString, this.getReqOptionsWOAuth()) // ...using post request
    // .map((res: Response) => {
    //   let resp = res.json();
    //   let optResp = new OperationResponse();
    //   optResp.CoolJWToken = resp.CoolJWToken;
    //   optResp.RecordCount = resp.RecordCount;
    //   optResp.ResponseStatus = resp.ResponseStatus;
    //   return optResp;
    // }) // ...and calling .json() on the response to return data
    // .map((res: Response) => res) // ...and calling .json() on the response to return data
    // .catch((error: any) =>
    //   Observable.throw(error.json().error || 'Server error')
    // ); //...errors if any
  }

  logout() {
    return this.http.post<any>(this.serConfig.baseUrl + "Login/Logout", "", this.getReqOptions())
  }

  getSystemInfo() {
    return this.http.get<any>(this.serConfig.baseUrl + "Login/GetSystemInfo", this.getReqOptions()) 
  }

  getLangList() {
    return this.http.get<any>(this.serConfig.baseUrl + "Login/GetLangList", this.getReqOptionsWOAuth())
  }

  getAllLangRes(langKey: string) {
    let requestPath = this.serConfig.baseUrl + "Login/GetAllLangRes";

    if (langKey != null && langKey != "") {
      requestPath = requestPath + "?langKey=" + langKey;
    }

    return this.http.get<any>(requestPath, this.getReqOptionsWOAuth())
  }

  refreshCoolJWT(langKey: string): Observable<OperationResponse>
  {
    let requestPath = this.serConfig.baseUrl + "Login/RefreshCoolJWT";

    if (langKey != null && langKey != "") {
      requestPath = requestPath + "?langKey=" + langKey;
    }

    return this.http.get<OperationResponse>(requestPath, this.getReqOptions());
  }

  getLoginInfo()
  {
    return this.http.post<any>(this.serConfig.baseUrl + "Login/GetLoginUserInfo", "", this.getReqOptions());
  }
}
