import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { RemoveUnderscorePipe } from 'src/app/pipes/remove-underscore.pipe';



@NgModule({
  declarations: [
    LoadingComponent,
    RemoveUnderscorePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingComponent,
    RemoveUnderscorePipe
  ]
})
export class SharedModule { }
