import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrayectoriaEscolarRoutingModule } from './trayectoria-escolar-routing.module';
import { TrayectoriaEscolarComponent } from './trayectoria-escolar.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TrayectoriaEscolarComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TrayectoriaEscolarRoutingModule
  ]
})
export class TrayectoriaEscolarModule { }
