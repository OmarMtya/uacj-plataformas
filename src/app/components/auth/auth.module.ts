import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    AuthComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
