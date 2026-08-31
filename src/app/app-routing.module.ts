import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import {authGuard} from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';
const routes: Routes = [
{
  path: '',
  component: AdminComponent,
    canActivate: [authGuard],
  children: [
    {
      path: 'dashboard',
      loadComponent: () => import('./pages/dashboard/dashboard').then((c) => c.Dashboard)
    },
    {
  path: 'users',
  canActivate: [adminGuard],
  loadComponent: () => import('./pages/users/user-list/user-list').then((c) => c.UserList)
    },
    {
  path: 'societes',
  loadComponent: () => import('./pages/societes/societe-list/societe-list').then((c) => c.SocieteList)
},
{
  path: 'societes/:id',
  loadComponent: () => import('./pages/societes/societe-detail/societe-detail').then((c) => c.SocieteDetail)
},
{
  path: 'projets',
  loadComponent: () => import('./pages/projets/projet-list/projet-list').then((c) => c.ProjetList)
},
{
        path: 'projets/:id',
        loadComponent: () => import('./pages/projets/projet-detail/projet-detail').then((c) => c.ProjetDetail)
      }

  ]
},
{
  path: '',
  component: GuestComponent,
  children: [
    {
      path: 'login',
      loadComponent: () => import('./pages/login/login').then((c) => c.Login)
    },
    {
      path: 'forgot-password',
      loadComponent: () => import('./pages/forgot-password/forgot-password').then((c) => c.ForgotPassword)
    },
    {
      path: 'reset-password',
      loadComponent: () => import('./pages/reset-password/reset-password').then((c) => c.ResetPassword)
    }
  ]
}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}