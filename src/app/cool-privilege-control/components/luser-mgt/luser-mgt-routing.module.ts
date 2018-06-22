import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Components
import { LuserListComponent } from './luser-list/luser-list.component';
import { CreateLuserComponent } from './create-luser/create-luser.component';
import { EditLuserComponent } from './edit-luser/edit-luser.component';

const routes: Routes = [
  { path: '', redirectTo: 'LUserList', pathMatch: 'full' },
  { path: 'LUserList', component: LuserListComponent, data: { breadcrumb: 'LUserList' } },
  { path: 'CreateLUser', component: CreateLuserComponent, data: { breadcrumb: 'CreateLUser' } },
  { path: 'EditLUser/:ID', component: EditLuserComponent, data: { breadcrumb: 'EditLUser' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LuserMgtRoutingModule { }
