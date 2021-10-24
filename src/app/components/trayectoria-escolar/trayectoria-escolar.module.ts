import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrayectoriaEscolarRoutingModule } from './trayectoria-escolar-routing.module';
import { TrayectoriaEscolarComponent } from './trayectoria-escolar.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    TrayectoriaEscolarComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TrayectoriaEscolarRoutingModule,
    SharedModule
  ]
})
export class TrayectoriaEscolarModule { }
