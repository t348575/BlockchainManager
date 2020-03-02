import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageChainPage } from './manage-chain.page';

const routes: Routes = [
  {
    path: '',
    component: ManageChainPage
  },
  {
    path: 'view-block',
    loadChildren: () => import('./view-block/view-block.module').then( m => m.ViewBlockPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageChainPageRoutingModule {}
