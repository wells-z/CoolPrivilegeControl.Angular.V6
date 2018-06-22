import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { SharedModule } from '../../../shared/shared.module';
import { CommonSharedModule } from "../common/common-shared/common-shared.module";

//Routing
import { RoleMgtRoutingModule } from './role-mgt-routing.module';

//Components
import { RoleListComponent } from './role-list/role-list.component';
import { CreateRoleComponent } from './create-role/create-role.component';
import { EditRoleComponent } from './edit-role/edit-role.component';

// Services
import { RoleMgtService } from "../../services/role-mgt.service";

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RoleMgtRoutingModule,
    CommonSharedModule
  ],
  declarations: [
    RoleListComponent, 
    CreateRoleComponent, 
    EditRoleComponent
  ],
  providers: [
    RoleMgtService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class RoleMgtModule { }
