import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../../shared/shared.module';

//Routing
import { AuthorMgtRoutingModule } from './author-mgt-routing.module';

//Components
import { AuthorListComponent } from './author-list/author-list.component';
import { AuthorDetailComponent } from './author-detail/author-detail.component';

// Service
import { AuthorMgtService } from "../../services/author-mgt.service";

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AuthorMgtRoutingModule
  ],
  declarations: [
    AuthorListComponent, 
    AuthorDetailComponent
  ],
  providers: [
    AuthorMgtService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  entryComponents: [AuthorDetailComponent],
})
export class AuthorMgtModule { }
