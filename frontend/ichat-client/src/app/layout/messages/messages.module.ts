import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessagesComponent } from './messages.component';
import { SharedModule } from '../../shared/module/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ],
  declarations: [MessagesComponent],
  exports: [MessagesComponent]
})
export class MessagesModule { }
