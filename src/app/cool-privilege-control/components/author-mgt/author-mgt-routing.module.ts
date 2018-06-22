import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Components
import { AuthorListComponent } from './author-list/author-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'AuthorList', pathMatch: 'full' },
  { path: 'AuthorList', component: AuthorListComponent, data: { breadcrumb: 'AuthorList' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthorMgtRoutingModule { }
