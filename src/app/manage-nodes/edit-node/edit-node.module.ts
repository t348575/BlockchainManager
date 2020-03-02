import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditNodePageRoutingModule } from './edit-node-routing.module';

import { EditNodePage } from './edit-node.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditNodePageRoutingModule
  ],
  declarations: [EditNodePage]
})
export class EditNodePageModule {}
