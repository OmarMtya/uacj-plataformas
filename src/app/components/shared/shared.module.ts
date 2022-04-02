import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { RemoveUnderscorePipe } from 'src/app/pipes/remove-underscore.pipe';
import { AcentosPipe } from 'src/app/pipes/acentos.pipe';
import { ChartComponent } from './chart/chart.component';



@NgModule({
  declarations: [
    LoadingComponent,
    RemoveUnderscorePipe,
    AcentosPipe,
    ChartComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingComponent,
    RemoveUnderscorePipe,
    AcentosPipe,
    ChartComponent,
  ]
})
export class SharedModule { }
