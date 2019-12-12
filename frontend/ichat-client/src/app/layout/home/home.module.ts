import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/module/shared.module';
import { UsersListModule } from '../users-list/users-list.module';
import { MessagesModule } from '../messages/messages.module';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    SharedModule,
    UsersListModule,
    MessagesModule
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }
