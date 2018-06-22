import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

//Guard
import { CanActivateViaAuthGuard } from './guards/can-activate-via-auth.guard';

//Components
import { CoolPrivilegeControlComponent } from './cool-privilege-control.component'

//Modules
// import { FuncMgtModule } from "./components/FuncMgt/func-mgt.module";
// import { FuncTypeMgtModule } from "./components/FuncTypeMgt/func-type-mgt.module";
// import { RoleMgtModule } from "./components/RoleMgt/role-mgt.module";
// import { LUserMgtModule } from "./components/LUserMgt/luser-mgt.module";
// import { OrgMgtModule } from "./components/OrgMgt/org-mgt.module";
// import { OrgDMgtModule } from "./components/OrgDMgt/org-dmgt.module";
// import { AuthorMgtModule } from "./components/AuthorMgt/author-mgt.module";
// import { AuditLogMgtModule } from "./components/AuditLogMgt/audit-log-mgt.module";
// import { LangMgtModule } from "./components/LangMgt/lang-mgt.module";
// import { SysInfoMgtModule } from "./components/SysInfoMgt/sys-info-mgt.module";

const funcMgtModule = 'app/cool-privilege-control/func-mgt/func-mgt.module#FuncMgtModule';
const funcTypeMgtModule = 'app/cool-privilege-control/func-type-mgt/func-type-mgt.module#FuncTypeMgtModule';
const roleMgtModule = 'app/cool-privilege-control/role-mgt/role-mgt.module#RoleMgtModule';
const auditlogMgtModule = 'app/cool-privilege-control/audit-log-mgt/audit-log-mgt.module#AuditLogMgtModule';
const langMgtModule = 'app/cool-privilege-control/lang-mgt/lang-mgt.module#LangMgtModule';

const routes: Routes = [
  { path: '', redirectTo: "/CoolPrivilegeControl/en", pathMatch: "full" },
  {
    path: ':LangKey',
    component: CoolPrivilegeControlComponent,
    data: { breadcrumb: 'CoolAccMgt' },
    canActivate: [CanActivateViaAuthGuard],
    children: [
      {
        path: 'FuncMgt',
        loadChildren: funcMgtModule,
        data: { breadcrumb: 'FuncMgt' },
        canActivateChild: [CanActivateViaAuthGuard]
      },
      { 
        path: 'FuncTMgt', 
        loadChildren: funcTypeMgtModule, 
        data: { breadcrumb: 'FuncTMgt' }, 
        canActivateChild: [CanActivateViaAuthGuard] 
      },
      { 
        path: 'RoleMgt', 
        loadChildren: roleMgtModule, 
        data: { breadcrumb: 'RoleMgt' }, 
        canActivateChild: [CanActivateViaAuthGuard] 
      },
      // { path: 'LUserMgt', loadChildren: () => LUserMgtModule, data: { breadcrumb: 'LUserMgt' }, canActivateChild: [CanActivateViaAuthGuard] },
      // { path: 'OrgMgt', loadChildren: () => OrgMgtModule, data: { breadcrumb: 'OrgMgt' }, canActivateChild: [CanActivateViaAuthGuard] },
      // { path: 'OrgDMgt', loadChildren: () => OrgDMgtModule, data: { breadcrumb: 'OrgDMgt' }, canActivateChild: [CanActivateViaAuthGuard] },
      // { path: 'AuthorMgt', loadChildren: () => AuthorMgtModule, data: { breadcrumb: 'AuthorMgt' }, canActivateChild: [CanActivateViaAuthGuard] },
      { 
        path: 'AuditMgt', 
        loadChildren: auditlogMgtModule, 
        data: { breadcrumb: 'AuditMgt' }, 
        canActivateChild: [CanActivateViaAuthGuard] 
      },
      { 
        path: 'LangMgt', 
        loadChildren: langMgtModule, 
        data: { breadcrumb: 'LangMgt' }, 
        canActivateChild: [CanActivateViaAuthGuard] 
      },
      // { path: 'SysInfoMgt', loadChildren: () => SysInfoMgtModule, data: { breadcrumb: 'SysInfoMgt' }, canActivateChild: [CanActivateViaAuthGuard] },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoolPrivilegeControlRoutingModule { }
