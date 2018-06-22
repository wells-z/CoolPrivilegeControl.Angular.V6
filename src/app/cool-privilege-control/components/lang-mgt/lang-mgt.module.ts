import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../../shared/shared.module';
import { CommonSharedModule } from "../common/common-shared/common-shared.module";

//Routing
import { LangMgtRoutingModule } from './lang-mgt-routing.module';

//Components
import { LangListComponent } from './lang-list/lang-list.component';
import { CreateLangComponent } from './create-lang/create-lang.component';
import { EditLangComponent } from './edit-lang/edit-lang.component';

// Service
import { LangMgtService } from "../../services/lang-mgt.service";

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    LangMgtRoutingModule,
    CommonSharedModule
  ],
  declarations: [
    LangListComponent, 
    CreateLangComponent, 
    EditLangComponent
  ],
  providers:[
    LangMgtService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class LangMgtModule { }
