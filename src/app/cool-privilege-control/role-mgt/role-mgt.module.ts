import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';

//Routing
import { RoleMgtRoutingModule } from './role-mgt-routing.module';

//Components
import { RoleListComponent } from './role-list/role-list.component';
import { CreateRoleComponent } from './create-role/create-role.component';
import { EditRoleComponent } from './edit-role/edit-role.component';

// Service
import { LoginService } from "../services/login.service";
import { FuncMgtService } from "../services/func-mgt.service";
import { FuncTypeMgtService } from "../services/func-type-mgt.service";
import { PrivilegeCheckService } from "../services/privilege-check.service";

import { RoleMgtService } from "../services/role-mgt.service";

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RoleMgtRoutingModule
  ],
  declarations: [
    RoleListComponent, 
    CreateRoleComponent, 
    EditRoleComponent
  ],
  providers: [
    LoginService, 
    FuncMgtService, 
    FuncTypeMgtService, 
    PrivilegeCheckService,
    RoleMgtService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class RoleMgtModule { }
