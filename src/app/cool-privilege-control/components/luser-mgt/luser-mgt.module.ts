import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../../shared/shared.module';
import { CommonSharedModule } from "../common/common-shared/common-shared.module";

//Routing
import { LuserMgtRoutingModule } from './luser-mgt-routing.module';

//Components
import { LuserListComponent } from './luser-list/luser-list.component';
import { CreateLuserComponent } from './create-luser/create-luser.component';
import { EditLuserComponent } from './edit-luser/edit-luser.component';

//Services
import { LuserMgtService } from "../../services/luser-mgt.service";

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    LuserMgtRoutingModule,
    CommonSharedModule
  ],
  declarations: [
    LuserListComponent, 
    CreateLuserComponent, 
    EditLuserComponent
  ],
  providers:[ 
    LuserMgtService,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class LuserMgtModule { }
