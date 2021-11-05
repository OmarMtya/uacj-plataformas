import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./components/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: 'trayectoria-escolar', loadChildren: () => import('./components/trayectoria-escolar/trayectoria-escolar.module').then(m => m.TrayectoriaEscolarModule) },
  { path: 'desarrollo-institucional', loadChildren: () => import('./components/desarrollo-institucional/desarrollo-institucional.module').then(m => m.DesarrolloInstitucionalModule) }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
