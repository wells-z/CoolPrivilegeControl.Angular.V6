import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
// import { WebStorageModule } from 'ngx-store';
import { Ng2Webstorage } from 'ngx-webstorage';
import { FlexLayoutModule, BREAKPOINTS } from "@angular/flex-layout";

import { HttpClientModule } from '@angular/common/http';
import { InjectionToken, Injector, TemplateRef } from '@angular/core';

import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';
///Configurations
import { CoolPrivilegeSerconfig } from './cool-privilege-control/cool-privilege-serconfig';
import { COOLPRIVILEGECONFIG } from "./cool-privilege-control/cool-privilege-serconfig-token";

///Services
import { LoginService } from './cool-privilege-control/services/login.service';
import { LoadingDialogService } from './cool-privilege-control/services/loading-dialog.service';
import { MsgDialogService } from './cool-privilege-control/services/msg-dialog.service';
import { PrivilegeService } from './cool-privilege-control/services/privilege.service';
import { PrivilegeCheckService } from "./cool-privilege-control/services/privilege-check.service";
import { RoutingHistoryService } from './cool-privilege-control/services/routing-history.service';
///Guards
// import { CanActivateViaAuthGuardGuard } from "./cool-privilege-control/Guards/can-activate-via-auth-guard.guard";

///Components
import { DialogComponent } from './cool-privilege-control/components/common/dialog/dialog.component';
import { LoadingDialogComponent } from './cool-privilege-control/components/common/loading-dialog/loading-dialog.component';
import { MsgDialogComponent } from './cool-privilege-control/components/common/msg-dialog/msg-dialog.component';
import { PrivilegeComponent } from './cool-privilege-control/components/common/privilege/privilege.component';

@NgModule({
  declarations: [
    AppComponent,
    DialogComponent,
    LoadingDialogComponent,
    MsgDialogComponent,
    PrivilegeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    SharedModule,
    // WebStorageModule,
    Ng2Webstorage,
    AppRoutingModule,
    FlexLayoutModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    LoginService,
    LoadingDialogService,
    MsgDialogService,
    PrivilegeService,
    PrivilegeCheckService,
    RoutingHistoryService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { disableClose: true, autoFocus: true, hasBackdrop: true } },
    // { provide: COOLPRIVILEGECONFIG, useValue: { baseUrl: "http://localhost:1622/api/" } },
    { provide: COOLPRIVILEGECONFIG, useValue: { baseUrl: "http://API.wellstech.us/api/" } }
  ],
  bootstrap: [AppComponent],
  entryComponents: [MsgDialogComponent,DialogComponent, LoadingDialogComponent, PrivilegeComponent],
})
export class AppModule { }
