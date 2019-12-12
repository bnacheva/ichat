import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/module/shared.module';
import { CommonModule } from '@angular/common';

import { UsersListComponent } from './users-list.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule
    ],
    declarations: [UsersListComponent],
    exports: [UsersListComponent]
})
export class UsersListModule {
}
