import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageChainPageRoutingModule } from './manage-chain-routing.module';

import { ManageChainPage } from './manage-chain.page';
import {ViewBlockPage} from './view-block/view-block.page';
import {ViewBlockPageModule} from './view-block/view-block.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageChainPageRoutingModule,
    ViewBlockPageModule
  ],
  declarations: [ManageChainPage]
})
export class ManageChainPageModule {}
