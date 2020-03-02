import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeleteNodePage } from './delete-node.page';

const routes: Routes = [
  {
    path: '',
    component: DeleteNodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeleteNodePageRoutingModule {}
