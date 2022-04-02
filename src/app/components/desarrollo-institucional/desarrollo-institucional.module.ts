import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesarrolloInstitucionalRoutingModule } from './desarrollo-institucional-routing.module';
import { DesarrolloInstitucionalComponent } from './desarrollo-institucional.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: [
    DesarrolloInstitucionalComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    DesarrolloInstitucionalRoutingModule,
    SharedModule,
  ]
})
export class DesarrolloInstitucionalModule { }
