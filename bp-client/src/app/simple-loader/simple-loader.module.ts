import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SimpleLoaderComponent} from './simple-loader.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    SimpleLoaderComponent
  ],
  declarations: [
    SimpleLoaderComponent
  ]
})
export class SimpleLoaderModule { }
