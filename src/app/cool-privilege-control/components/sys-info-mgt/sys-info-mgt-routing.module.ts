import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Components
import { SysInfoMgtListComponent } from './sys-info-mgt-list/sys-info-mgt-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'EditSysInfo', pathMatch: 'full' },
  { path: 'EditSysInfo', component: SysInfoMgtListComponent, data: { breadcrumb: 'UpdateSysInfo' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SysInfoMgtRoutingModule { }
