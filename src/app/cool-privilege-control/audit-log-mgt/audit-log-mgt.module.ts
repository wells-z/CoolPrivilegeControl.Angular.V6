import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';

//Routing
import { AuditLogMgtRoutingModule } from './audit-log-mgt-routing.module';

//Components
import { AuditLogListComponent } from './audit-log-list/audit-log-list.component';
import { AuditLogDetailComponent } from './audit-log-detail/audit-log-detail.component';

// Service
import { LoginService } from "../services/login.service";
import { PrivilegeCheckService } from "../services/privilege-check.service";

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AuditLogMgtRoutingModule
  ],
  declarations: [
    AuditLogListComponent,
    AuditLogDetailComponent
  ],
  providers: [
    LoginService,
    PrivilegeCheckService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  entryComponents: [AuditLogDetailComponent],
})
export class AuditLogMgtModule { }
