import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { SharedModule } from '../../../shared/shared.module';

//Routing
import { FuncTypeMgtRoutingModule } from './func-type-mgt-routing.module';

//Components
import { FuncTypeListComponent } from './func-type-list/func-type-list.component';
import { EditFuncTypeComponent } from './edit-func-type/edit-func-type.component';
import { CreateFuncTypeComponent } from './create-func-type/create-func-type.component';

// Service
import { FuncTypeMgtService } from "../../services/func-type-mgt.service";

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
    FuncTypeMgtService, 
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class FuncTypeMgtModule { }
