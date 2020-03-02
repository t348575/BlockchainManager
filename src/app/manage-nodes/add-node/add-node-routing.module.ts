import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddNodePage } from './add-node.page';

const routes: Routes = [
  {
    path: '',
    component: AddNodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddNodePageRoutingModule {}
