import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FindNodesPageRoutingModule } from './find-nodes-routing.module';

import { FindNodesPage } from './find-nodes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FindNodesPageRoutingModule
  ],
  declarations: [FindNodesPage]
})
export class FindNodesPageModule {}
