import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Components
import { FuncListComponent } from './func-list/func-list.component';
import { CreateFuncComponent } from './create-func/create-func.component';
import { EditFuncComponent } from './edit-func/edit-func.component';

const routes: Routes = [
  { path: '', redirectTo: 'FuncList', pathMatch: 'full' },
  { path: 'FuncList', component: FuncListComponent, data: { breadcrumb: 'FuncList' } },
  { path: 'CreateFunc', component: CreateFuncComponent, data: { breadcrumb: 'CreateFunc' } },
  { path: 'EditFunc/:ID', component: EditFuncComponent, data: { breadcrumb: 'EditFunc' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FuncMgtRoutingModule { }
