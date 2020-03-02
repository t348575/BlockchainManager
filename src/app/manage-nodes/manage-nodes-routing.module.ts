import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageNodesPage } from './manage-nodes.page';

const routes: Routes = [
  {
    path: '',
    component: ManageNodesPage
  },
  {
    path: 'find-nodes',
    loadChildren: () => import('./find-nodes/find-nodes.module').then(m => m.FindNodesPageModule)
  },
  {
    path: 'add-node',
    loadChildren: () => import('./add-node/add-node.module').then( m => m.AddNodePageModule)
  },
  {
    path: 'edit-node',
    loadChildren: () => import('./edit-node/edit-node.module').then( m => m.EditNodePageModule)
  },
  {
    path: 'delete-node',
    loadChildren: () => import('./delete-node/delete-node.module').then( m => m.DeleteNodePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageNodesPageRoutingModule {}
