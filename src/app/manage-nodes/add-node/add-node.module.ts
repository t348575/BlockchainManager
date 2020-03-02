import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddNodePageRoutingModule } from './add-node-routing.module';

import { AddNodePage } from './add-node.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddNodePageRoutingModule
  ],
  declarations: [AddNodePage]
})
export class AddNodePageModule {}
