import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';

//Routing
import { FuncTypeMgtRoutingModule } from './func-type-mgt-routing.module';

//Components
import { FuncTypeListComponent } from './func-type-list/func-type-list.component';
import { EditFuncTypeComponent } from './edit-func-type/edit-func-type.component';
import { CreateFuncTypeComponent } from './create-func-type/create-func-type.component';

// Service
import { LoginService } from "../services/login.service";
import { FuncMgtService } from "../services/func-mgt.service";
import { FuncTypeMgtService } from "../services/func-type-mgt.service";
import { PrivilegeCheckService } from "../services/privilege-check.service";

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    FuncTypeMgtRoutingModule
  ],
  declarations: [
    FuncTypeListComponent, 
    EditFuncTypeComponent, 
    CreateFuncTypeComponent
  ],
  providers: [
    LoginService, 
    FuncMgtService, 
    FuncTypeMgtService, 
    PrivilegeCheckService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class FuncTypeMgtModule { }
