import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrayectoriaEscolarComponent } from './trayectoria-escolar.component';

const routes: Routes = [
  {
    path: '',
    component: TrayectoriaEscolarComponent
  },
  {
    path: '**',
    redirectTo: '',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrayectoriaEscolarRoutingModule { }
