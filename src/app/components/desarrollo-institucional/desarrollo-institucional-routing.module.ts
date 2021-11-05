import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DesarrolloInstitucionalComponent } from './desarrollo-institucional.component';

const routes: Routes = [{ path: '', component: DesarrolloInstitucionalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesarrolloInstitucionalRoutingModule { }
