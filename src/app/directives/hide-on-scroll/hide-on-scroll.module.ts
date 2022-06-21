import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HideOnScrollDirective } from './hide-on-scroll.directive';



@NgModule({
  declarations: [
    HideOnScrollDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HideOnScrollDirective
  ]
})
export class HideOnScrollModule { }
