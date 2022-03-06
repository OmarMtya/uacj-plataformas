import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { AuthGuard } from './guards/auth.guard';
import { NoauthGuard } from './guards/noauth.guard';

const routes: Routes = [
  {
    path: 'plataformas',
    loadChildren: () => import('./components/tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'trayectoria-escolar',
    loadChildren: () => import('./components/trayectoria-escolar/trayectoria-escolar.module').then(m => m.TrayectoriaEscolarModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'desarrollo-institucional',
    loadChildren: () => import('./components/desarrollo-institucional/desarrollo-institucional.module').then(m => m.DesarrolloInstitucionalModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'informe-anual',
    loadChildren: () => import('./components/informe-anual/informe-anual.module').then(m => m.InformeAnualModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule),
    canActivate: [NoauthGuard]
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];
const isIframe = window !== window.parent && !window.opener;

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true, initialNavigation: !isIframe ? 'enabled' : 'disabled' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
