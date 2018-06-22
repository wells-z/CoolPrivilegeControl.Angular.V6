import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Components
import { AuditLogListComponent } from './audit-log-list/audit-log-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'AuditLogList', pathMatch: 'full' },
  { path: 'AuditLogList', component: AuditLogListComponent, data: { breadcrumb: 'AuditLogList' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditLogMgtRoutingModule { }
