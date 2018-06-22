import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Components
import { OrgListComponent } from './org-list/org-list.component';
import { CreateOrgComponent } from './create-org/create-org.component';
import { EditOrgComponent } from './edit-org/edit-org.component';

const routes: Routes = [
  { path: '', redirectTo: 'OrgList', pathMatch: 'full' },
  { path: 'OrgList', component: OrgListComponent, data: { breadcrumb: 'OrgList' } },
  { path: 'CreateOrg', component: CreateOrgComponent, data: { breadcrumb: 'CreateOrg' } },
  { path: 'EditOrg/:ID', component: EditOrgComponent, data: { breadcrumb: 'EditOrg' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrgMgtRoutingModule { }
