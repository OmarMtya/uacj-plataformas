import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'plataformas',
    loadChildren: () => import('./components/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'trayectoria-escolar',
    loadChildren: () => import('./components/trayectoria-escolar/trayectoria-escolar.module').then(m => m.TrayectoriaEscolarModule)
  },
  {
    path: 'desarrollo-institucional',
    loadChildren: () => import('./components/desarrollo-institucional/desarrollo-institucional.module').then(m => m.DesarrolloInstitucionalModule)
  },
  {
    path: 'informe-anual',
    loadChildren: () => import('./components/informe-anual/informe-anual.module').then(m => m.InformeAnualModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule)
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
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
