import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FindNodesPage } from './find-nodes.page';

const routes: Routes = [
  {
    path: '',
    component: FindNodesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FindNodesPageRoutingModule {}
