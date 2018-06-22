import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';

//Routing
import { LangMgtRoutingModule } from './lang-mgt-routing.module';

//Components
import { LangListComponent } from './lang-list/lang-list.component';
import { CreateLangComponent } from './create-lang/create-lang.component';
import { EditLangComponent } from './edit-lang/edit-lang.component';

// Service
import { LoginService } from '../services/login.service';
import { PrivilegeCheckService } from '../services/privilege-check.service';
import { LangMgtService } from "../services/lang-mgt.service";

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    LangMgtRoutingModule
  ],
  declarations: [
    LangListComponent, 
    CreateLangComponent, 
    EditLangComponent
  ],
  providers:[
    LoginService,
    PrivilegeCheckService,
    LangMgtService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class LangMgtModule { }
