import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, CanDeactivate } from '@angular/router';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
// import { map, startWith } from 'rxjs/operators'

import { Observable } from 'rxjs';

import { map, startWith } from 'rxjs/operators'

// import 'rxjs/observable/of';
// import 'rxjs/operators/map';
// import 'rxjs/operator/switchMap';

import { LocalStorage, SessionStorage } from 'ngx-webstorage';
import { LoginService } from "../services/login.service";
import { LoadingDialogService } from "../services/loading-dialog.service";

@Injectable({
  providedIn: 'root'
})
export class CanActivateViaAuthGuard implements CanActivate, CanActivateChild {

  @LocalStorage()
  public LangKey: string;

  @LocalStorage()
  public AuthKey: string;

  constructor(private router: Router, private loginSer: LoginService, private loadingDialogSer: LoadingDialogService) {

  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.loginSer.refreshCoolJWT(this.LangKey).pipe(
      map(resp => {
        let val = false;
        if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
          val = true;

          this.loadingDialogSer.refreshAuthKey(resp);
        }
        else if (resp != null) {
          val = false;
          if (resp.ResponseStatus.ErrorCode == "401") {
            this.router.navigate(["login", this.LangKey]);
            // this.router.navigate(["/login/en"]);
            //window.location.href = window.location.href.substr(0, window.location.href.indexOf("CoolPrivilegeControl")) + "login/" + this.LangKey;
          }
        }
        return val;
      }));
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.loginSer.refreshCoolJWT(this.LangKey).pipe(
      map(resp => {
        let val = false;
        if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
          val = true;

          this.loadingDialogSer.refreshAuthKey(resp);
        }
        else if (resp != null) {
          val = false;
          if (resp.ResponseStatus.ErrorCode == "401") {
            this.router.navigate(["login", this.LangKey]);
            // this.router.navigate(["/login/en"]);
            //window.location.href = window.location.href.substr(0, window.location.href.indexOf("CoolPrivilegeControl")) + "login/" + this.LangKey;
          }
        }
        return val;
      }));
  }
}
