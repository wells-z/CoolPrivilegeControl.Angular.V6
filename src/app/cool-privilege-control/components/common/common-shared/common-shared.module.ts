import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PagingBarComponent } from '../../common/paging-bar/paging-bar.component';
import { SharedModule } from '../../../../shared/shared.module';
import { SelectedFuncsComponent } from '../../common/selected-funcs/selected-funcs.component';
import { SelectedRolesComponent } from '../../common/selected-roles/selected-roles.component';
import { SelectedLuserOrgComponent } from '../../common/selected-luser-org/selected-luser-org.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ],
  declarations: [PagingBarComponent, SelectedFuncsComponent, SelectedRolesComponent, SelectedLuserOrgComponent],
  exports: [PagingBarComponent, SelectedFuncsComponent, SelectedRolesComponent, SelectedLuserOrgComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class CommonSharedModule { }
