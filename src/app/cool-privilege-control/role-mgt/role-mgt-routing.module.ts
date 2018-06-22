import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Components
import { RoleListComponent } from './role-list/role-list.component';
import { CreateRoleComponent } from './create-role/create-role.component';
import { EditRoleComponent } from './edit-role/edit-role.component';

const routes: Routes = [
  { path: '', redirectTo: 'RoleList', pathMatch: 'full' },
  { path: 'RoleList', component: RoleListComponent, data: { breadcrumb: 'RoleList' } },
  { path: 'CreateRole', component: CreateRoleComponent, data: { breadcrumb: 'CreateRole' } },
  { path: 'EditRole/:ID', component: EditRoleComponent, data: { breadcrumb: 'EditRole' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleMgtRoutingModule { }
