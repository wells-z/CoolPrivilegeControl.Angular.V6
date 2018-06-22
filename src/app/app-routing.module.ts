import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanActivateViaAuthGuard } from "./cool-privilege-control/guards/can-activate-via-auth.guard";

const loginModule = 'app/login/login.module#LoginModule';
const cpcModule = 'app/cool-privilege-control/cool-privilege-control.module#CoolPrivilegeControlModule';

const routes: Routes = [
  // {
  //   path: 'customers',
  //   loadChildren: 'app/customers/customers.module#CustomersModule'
  // },
  // {
  //   path: 'orders',
  //   loadChildren: 'app/orders/orders.module#OrdersModule'
  // },
  // {
  //   path: '',
  //   redirectTo: '',
  //   pathMatch: 'full'
  // }
  {
    path: '',
    loadChildren: loginModule
  },
  {
    path: 'CoolPrivilegeControl',
    //loadChildren: () => CoolPrivilegeControlModule,
    loadChildren: cpcModule,
    // loadChildren: () => new Promise(resolve => {
    //     (require as any).ensure([], require => {
    //         resolve(require('app/CoolPrivilegeControl/cool-privilege-control.module').CoolPrivilegeControlModule);
    //     })
    // }),
    canActivate: [CanActivateViaAuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
