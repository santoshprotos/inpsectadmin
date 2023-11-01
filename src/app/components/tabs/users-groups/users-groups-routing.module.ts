import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersGroupsPage } from './users-groups.page';

const routes: Routes = [
  {
    path: '',
    component: UsersGroupsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersGroupsPageRoutingModule {}
