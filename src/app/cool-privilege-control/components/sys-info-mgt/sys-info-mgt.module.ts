import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../../shared/shared.module';

//Routing
import { SysInfoMgtRoutingModule } from './sys-info-mgt-routing.module';

//Components
import { SysInfoMgtListComponent } from './sys-info-mgt-list/sys-info-mgt-list.component';

// Service
import { SysInfoMgtService } from "../../services/sys-info-mgt.service";

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    SysInfoMgtRoutingModule
  ],
  declarations: [
    SysInfoMgtListComponent
  ],
  providers:[
    SysInfoMgtService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SysInfoMgtModule { }
