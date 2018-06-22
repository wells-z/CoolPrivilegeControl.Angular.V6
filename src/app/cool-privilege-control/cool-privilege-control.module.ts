import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from "@angular/flex-layout";
import { SharedModule } from '../shared/shared.module';

// Routing
import { CoolPrivilegeControlRoutingModule } from './cool-privilege-control-routing.module';


import { CoolPrivilegeControlComponent } from './cool-privilege-control.component';

// Component
// Common Component
import { SideMenuComponent } from './components/common/side-menu/side-menu.component';
import { BreadCrumbComponent } from './components/common/bread-crumb/bread-crumb.component';

// Service
import { FuncMgtService } from './services/func-mgt.service';
import { FuncTypeMgtService } from './services/func-type-mgt.service';
import { OrgMgtService } from './services/org-mgt.service';
import { OrgDmgtService } from './services/org-dmgt.service';
import { RoleMgtService } from './services/role-mgt.service';


@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CoolPrivilegeControlRoutingModule,
  ],
  declarations: [
    CoolPrivilegeControlComponent,
    SideMenuComponent,
    BreadCrumbComponent,
  ],
  providers: [
    FuncMgtService,
    FuncTypeMgtService,
    OrgMgtService,
    OrgDmgtService,
    RoleMgtService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class CoolPrivilegeControlModule { }
