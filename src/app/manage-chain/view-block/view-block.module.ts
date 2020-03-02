import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewBlockPageRoutingModule } from './view-block-routing.module';

import { ViewBlockPage } from './view-block.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewBlockPageRoutingModule
  ],
  declarations: [ViewBlockPage]
})
export class ViewBlockPageModule {}
