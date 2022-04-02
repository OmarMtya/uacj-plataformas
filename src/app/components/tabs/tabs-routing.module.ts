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
      // {
      //   path: 'iaa',
      //   loadChildren: () => import('../informe-anual/informe-anual.module').then(m => m.InformeAnualModule)
      // },
      {
        path: '',
        redirectTo: '/plataformas/indicadores/edi',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/plataformas/indicadores/edi',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
