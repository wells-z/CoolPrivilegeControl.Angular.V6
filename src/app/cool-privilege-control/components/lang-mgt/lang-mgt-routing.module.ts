import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Components
import { LangListComponent } from './lang-list/lang-list.component';
import { CreateLangComponent } from './create-lang/create-lang.component';
import { EditLangComponent } from './edit-lang/edit-lang.component';

const routes: Routes = [
  { path: '', redirectTo: 'LangList', pathMatch: 'full' },
  { path: 'LangList', component: LangListComponent, data: { breadcrumb: 'LangList' } },
  { path: 'CreateLang', component: CreateLangComponent, data: { breadcrumb: 'CreateLang' } },
  { path: 'EditLang/:ID', component: EditLangComponent, data: { breadcrumb: 'EditLang' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LangMgtRoutingModule { }
