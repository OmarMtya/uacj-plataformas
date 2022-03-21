import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { RemoveUnderscorePipe } from 'src/app/pipes/remove-underscore.pipe';
import { AcentosPipe } from 'src/app/pipes/acentos.pipe';



@NgModule({
  declarations: [
    LoadingComponent,
    RemoveUnderscorePipe,
    AcentosPipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingComponent,
    RemoveUnderscorePipe,
    AcentosPipe
  ]
})
export class SharedModule { }
