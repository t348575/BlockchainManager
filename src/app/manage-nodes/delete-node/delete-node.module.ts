import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeleteNodePageRoutingModule } from './delete-node-routing.module';

import { DeleteNodePage } from './delete-node.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeleteNodePageRoutingModule
  ],
  declarations: [DeleteNodePage]
})
export class DeleteNodePageModule {}
