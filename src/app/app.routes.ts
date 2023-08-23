import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { isNotAuthenthicatedGuard } from './auth/guards/is-not-authenthicated.guard';
import { isAuthenticatedChildGuard } from './auth/guards/is-authenticated.guard';


export const routes: Routes = [
  {
    //LazyLoad
    path: 'auth',
    canActivate: [ isNotAuthenthicatedGuard ],
    loadChildren: () =>
      import('./auth/auth-routing.module').then( module => module.AuthRoutingModule )

  },
  {
    //LazyLoad
    path: 'dashboard',
    canActivate: [ isAuthenticatedChildGuard ],
    loadChildren: () =>
      import('./dashboard/dashboard-routing.module').then( module => module.DashboardRoutingModule )

  },
  {
    path:'**',
    redirectTo:'auth'
  },

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
