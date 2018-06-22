import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { SharedModule } from '../../../shared/shared.module';

//Routing
import { OrgDMgtRoutingModule } from './org-d-mgt-routing.module';

//Components
import { OrgDListComponent } from './org-d-list/org-d-list.component';
import { CreateOrgDComponent } from './create-org-d/create-org-d.component';
import { EditOrgDComponent } from './edit-org-d/edit-org-d.component';

// Services
import { OrgDmgtService } from "../../services/org-dmgt.service";

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    OrgDMgtRoutingModule
  ],
  declarations: [
    OrgDListComponent, 
    CreateOrgDComponent, 
    EditOrgDComponent
  ],
  providers: [
    OrgDmgtService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class OrgDMgtModule { }
