import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { ListRoutingModule } from './list-routing.module';
import { NbButtonModule, NbCardModule, NbCheckboxModule, NbInputModule, NbListModule } from '@nebular/theme';
import { ListService } from './services/list.service';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ListRoutingModule,
    NbListModule,
    NbCardModule,
    NbCheckboxModule,
    NbButtonModule,
    NbInputModule
  ],
  providers: [
    ListService
  ]
})
export class ListModule { }
