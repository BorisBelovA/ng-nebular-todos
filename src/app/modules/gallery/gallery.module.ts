import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryComponent } from './gallery.component';
import { GalleryRoutingModule } from './gallery-routing.module';
import { GalleryService } from './services/gallery.service';
import { NbButtonModule, NbCardModule, NbListModule } from '@nebular/theme';



@NgModule({
  declarations: [
    GalleryComponent
  ],
  imports: [
    CommonModule,
    GalleryRoutingModule,
    NbButtonModule,
    NbCardModule,
    NbListModule
  ],
  providers: [
    GalleryService
  ]
})
export class GalleryModule { }
