import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'list/:id', loadChildren: () => import('./modules/list/list.module').then(m => m.ListModule) },
  { path: 'gallery', loadChildren: () => import('./modules/gallery/gallery.module').then(m => m.GalleryModule) },
  { path: '**', redirectTo: 'gallery'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
