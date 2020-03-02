import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageNodesPageRoutingModule } from './manage-nodes-routing.module';

import { ManageNodesPage } from './manage-nodes.page';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {AddNodePageModule} from './add-node/add-node.module';
import {EditNodePageModule} from './edit-node/edit-node.module';
import {DeleteNodePageModule} from './delete-node/delete-node.module';
import {FindNodesPageModule} from './find-nodes/find-nodes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageNodesPageRoutingModule,
    NgxDatatableModule,
    AddNodePageModule,
    EditNodePageModule,
    DeleteNodePageModule,
    FindNodesPageModule
  ],
  declarations: [ManageNodesPage]
})
export class ManageNodesPageModule {}
