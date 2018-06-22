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
import { FuncMgtService } from "./services/func-mgt.service";
import { PagingBarComponent } from './components/common/paging-bar/paging-bar.component';
import { SelectedFuncsComponent } from './components/common/selected-funcs/selected-funcs.component';
import { SelectedRolesComponent } from './components/common/selected-roles/selected-roles.component';
import { SelectedLuserOrgComponent } from './components/common/selected-luser-org/selected-luser-org.component';


@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CoolPrivilegeControlRoutingModule
  ],
  declarations: [
    CoolPrivilegeControlComponent,
    SideMenuComponent,
    BreadCrumbComponent,
    PagingBarComponent,
    SelectedFuncsComponent,
    SelectedRolesComponent,
    SelectedLuserOrgComponent
  ],
  providers: [
    // FuncMgtService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class CoolPrivilegeControlModule { }
