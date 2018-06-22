import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { SharedModule } from '../../../shared/shared.module';
import { CommonSharedModule } from "../common/common-shared/common-shared.module";

//Routing
import { OrgMgtRoutingModule } from './org-mgt-routing.module';

//Components
import { OrgListComponent } from './org-list/org-list.component';
import { CreateOrgComponent } from './create-org/create-org.component';
import { EditOrgComponent } from './edit-org/edit-org.component';

// Service
import { OrgMgtService } from "../../services/org-mgt.service";

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    OrgMgtRoutingModule,
    CommonSharedModule
  ],
  declarations: [
    OrgListComponent, 
    CreateOrgComponent, 
    EditOrgComponent
  ],
  providers: [
    OrgMgtService,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class OrgMgtModule { }
