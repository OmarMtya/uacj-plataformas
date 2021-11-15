import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesarrolloInstitucionalRoutingModule } from './desarrollo-institucional-routing.module';
import { DesarrolloInstitucionalComponent } from './desarrollo-institucional.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { ChartModule } from 'angular2-chartjs';


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
    ChartModule
  ]
})
export class DesarrolloInstitucionalModule { }
