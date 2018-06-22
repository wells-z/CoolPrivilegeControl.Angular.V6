import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

//Guard
import { CanActivateViaAuthGuard } from './guards/can-activate-via-auth.guard';

//Components
import { CoolPrivilegeControlComponent } from './cool-privilege-control.component'

const funcMgtModule = 'app/cool-privilege-control/components/func-mgt/func-mgt.module#FuncMgtModule';
const funcTypeMgtModule = 'app/cool-privilege-control/components/func-type-mgt/func-type-mgt.module#FuncTypeMgtModule';
const roleMgtModule = 'app/cool-privilege-control/components/role-mgt/role-mgt.module#RoleMgtModule';
const auditlogMgtModule = 'app/cool-privilege-control/components/audit-log-mgt/audit-log-mgt.module#AuditLogMgtModule';
const authorMgtModule = 'app/cool-privilege-control/components/author-mgt/author-mgt.module#AuthorMgtModule';
const langMgtModule = 'app/cool-privilege-control/components/lang-mgt/lang-mgt.module#LangMgtModule';
const luserMgtModule = 'app/cool-privilege-control/components/luser-mgt/luser-mgt.module#LuserMgtModule';
const orgMgtModule = 'app/cool-privilege-control/components/org-mgt/org-mgt.module#OrgMgtModule';
const orgDMgtModule = 'app/cool-privilege-control/components/org-d-mgt/org-d-mgt.module#OrgDMgtModule';
const sysInfoMgtModule = 'app/cool-privilege-control/components/sys-info-mgt/sys-info-mgt.module#SysInfoMgtModule';

const routes: Routes = [
  { path: '', redirectTo: "/CoolPrivilegeControl/en", pathMatch: "full" },
  {
    path: ':LangKey',
    component: CoolPrivilegeControlComponent,
    data: { breadcrumb: 'CoolAccMgt' },
    canActivate: [CanActivateViaAuthGuard],
    children: [
      { path: 'FuncMgt', loadChildren: funcMgtModule, data: { breadcrumb: 'FuncMgt' }, canActivateChild: [CanActivateViaAuthGuard] },
      { path: 'FuncTMgt', loadChildren: funcTypeMgtModule, data: { breadcrumb: 'FuncTMgt' }, canActivateChild: [CanActivateViaAuthGuard] },
      { path: 'RoleMgt', loadChildren: roleMgtModule, data: { breadcrumb: 'RoleMgt' }, canActivateChild: [CanActivateViaAuthGuard] },
      { path: 'LUserMgt', loadChildren: luserMgtModule, data: { breadcrumb: 'LUserMgt' }, canActivateChild: [CanActivateViaAuthGuard] },
      { path: 'OrgMgt', loadChildren: orgMgtModule, data: { breadcrumb: 'OrgMgt' }, canActivateChild: [CanActivateViaAuthGuard] },
      { path: 'OrgDMgt', loadChildren: orgDMgtModule, data: { breadcrumb: 'OrgDMgt' }, canActivateChild: [CanActivateViaAuthGuard] },
      { path: 'AuthorMgt', loadChildren: authorMgtModule, data: { breadcrumb: 'AuthorMgt' }, canActivateChild: [CanActivateViaAuthGuard] },
      { path: 'AuditMgt', loadChildren: auditlogMgtModule, data: { breadcrumb: 'AuditMgt' }, canActivateChild: [CanActivateViaAuthGuard] },
      { path: 'LangMgt', loadChildren: langMgtModule, data: { breadcrumb: 'LangMgt' }, canActivateChild: [CanActivateViaAuthGuard] },
      { path: 'SysInfoMgt', loadChildren: sysInfoMgtModule, data: { breadcrumb: 'SysInfoMgt' }, canActivateChild: [CanActivateViaAuthGuard] },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoolPrivilegeControlRoutingModule { }
