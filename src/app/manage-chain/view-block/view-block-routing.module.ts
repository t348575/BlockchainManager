import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewBlockPage } from './view-block.page';

const routes: Routes = [
  {
    path: '',
    component: ViewBlockPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewBlockPageRoutingModule {}
