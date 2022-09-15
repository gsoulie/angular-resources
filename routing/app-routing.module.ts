import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'parent',
    loadChildren: () => import('./components/standalone/parent/routes').then(mod => mod.STANDALONE_ROUTES)
    //loadComponent: () => import('./components/standalone/parent/parent.component').then(m => m.ParentComponent) // standalone component sans routes enfants
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
