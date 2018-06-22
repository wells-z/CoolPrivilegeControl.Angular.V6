import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Components
import { FuncTypeListComponent } from './func-type-list/func-type-list.component';
import { EditFuncTypeComponent } from './edit-func-type/edit-func-type.component';
import { CreateFuncTypeComponent } from './create-func-type/create-func-type.component';

const routes: Routes = [
  { path: '', redirectTo: 'FuncTypeList', pathMatch: 'full' },
  { path: 'FuncTypeList', component: FuncTypeListComponent, data: { breadcrumb: 'FuncTypeList' } },
  { path: 'CreateFuncType', component: CreateFuncTypeComponent, data: { breadcrumb: 'CreateFuncType' } },
  { path: 'EditFuncType/:ID', component: EditFuncTypeComponent, data: { breadcrumb: 'EditFuncType' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FuncTypeMgtRoutingModule { }
