import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { WebStorageModule } from 'ngx-store';

import { SharedModule } from '../../../shared/shared.module';

//Routing
import { FuncMgtRoutingModule } from './func-mgt-routing.module';

//Components
import { FuncListComponent } from './func-list/func-list.component';
import { CreateFuncComponent } from './create-func/create-func.component';
import { EditFuncComponent } from './edit-func/edit-func.component';

//Services
import { FuncMgtService } from '../../services/func-mgt.service';


@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    FuncMgtRoutingModule,
  ],
  declarations: [
    FuncListComponent,
    CreateFuncComponent,
    EditFuncComponent],
  providers: [
    FuncMgtService,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class FuncMgtModule { }
