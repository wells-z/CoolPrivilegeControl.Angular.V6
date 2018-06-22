import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Components
import { OrgDListComponent } from './org-d-list/org-d-list.component';
import { CreateOrgDComponent } from './create-org-d/create-org-d.component';
import { EditOrgDComponent } from './edit-org-d/edit-org-d.component';

const routes: Routes = [
  { path: '', redirectTo: 'OrgDList', pathMatch: 'full' },
  { path: 'OrgDList', component: OrgDListComponent, data: { breadcrumb: 'OrgDList' } },
  { path: 'CreateOrgD', component: CreateOrgDComponent, data: { breadcrumb: 'CreateOrgD' } },
  { path: 'EditOrgD/:ID', component: EditOrgDComponent, data: { breadcrumb: 'EditOrgD' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrgDMgtRoutingModule { }
