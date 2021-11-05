import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'indicadores',
    component: TabsPage,
    children: [
      {
        path: 'te',
        loadChildren: () => import('../trayectoria-escolar/trayectoria-escolar.module').then(m => m.TrayectoriaEscolarModule)
      },
      {
        path: 'edi',
        loadChildren: () => import('../desarrollo-institucional/desarrollo-institucional-routing.module').then(m => m.DesarrolloInstitucionalRoutingModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: '',
        redirectTo: '/indicadores/te',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/indicadores/te',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
