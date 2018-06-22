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
import { SearchableVm } from "../models/searchable-vm";
import { LangVm } from "../models/lang-vm";

//Basic Service
import { CommonService } from "./common.service";

@Injectable({
  providedIn: 'root'
})
export class LangMgtService extends CommonService {

  constructor(private http: HttpClient, injector: Injector) {
    super(injector);
  }

  searchLangList(searchableVM: SearchableVm): any {
    let bodyString = JSON.stringify(searchableVM); // Stringify payload
    return this.http.post<any>(this.serConfig.baseUrl + "LangMgmt/SearchLangs", bodyString, this.getReqOptions());
  }

  getLangByLangId(langKey: string, langId: string) {
    let requestPath = this.serConfig.baseUrl + "LangMgmt/GetLangByLangId";

    if (langKey != null && langKey != "") {
      requestPath = requestPath + "?langKey=" + langKey;
    }
    if (langId != null && langId != "") {
      requestPath = requestPath + "&langId=" + langId;
    }

    return this.http.get<any>(requestPath, this.getReqOptions());
  }

  createLang(langVM: LangVm) {
    let bodyString = JSON.stringify(langVM); // Stringify payload

    return this.http.post<any>(this.serConfig.baseUrl + "LangMgmt/CreateLang", bodyString, this.getReqOptions());
  }

  editLang(langVM: LangVm) {
    let bodyString = JSON.stringify(langVM); // Stringify payload

    return this.http.post<any>(this.serConfig.baseUrl + "LangMgmt/EditLang", bodyString, this.getReqOptions());
  }

  delLang(langVM: LangVm) {
    let bodyString = JSON.stringify(langVM); // Stringify payload

    return this.http.post<any>(this.serConfig.baseUrl + "LangMgmt/DelLang", bodyString, this.getReqOptions());
  }

}
