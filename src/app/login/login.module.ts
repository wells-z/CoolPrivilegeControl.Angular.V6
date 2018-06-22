import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { LoginRoutingModule } from './login-routing.module';

//Components
import { LoginComponent } from './login/login.component';

// Service
import { LoginService } from '../cool-privilege-control/services/login.service';
import { LoadingDialogService } from '../cool-privilege-control/services/loading-dialog.service'
import { MsgDialogService } from '../cool-privilege-control/services/msg-dialog.service'

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    LoginRoutingModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  declarations: [LoginComponent],
  providers: [
    // LoginService,
    // LoadingDialogService,
    // MsgDialogService
  ],
})
export class LoginModule { }
