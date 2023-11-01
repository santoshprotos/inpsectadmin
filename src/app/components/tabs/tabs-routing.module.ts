import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardPage } from './dashboard/dashboard.page';
import { FacilitiesPage } from './facilities/facilities.page';
import { InspectionsPage } from './inspections/inspections.page';
import { UsersGroupsPage } from './users-groups/users-groups.page';
import { RoleAssignmentPage } from './role-assignment/role-assignment.page';
import { TabsPage } from './tabs.page';
import { AuthGuard } from 'src/app/accessguard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        component:DashboardPage,
        canActivate: [ AuthGuard ]   
      },
      {
        path: 'inspections',
        component:InspectionsPage,
        canActivate: [ AuthGuard ]   
      },
      {
        path: 'facilities',
        component:FacilitiesPage,
        canActivate: [ AuthGuard ]   
       },
      {
        path: 'users-groups',
        component: UsersGroupsPage,
        canActivate: [ AuthGuard ]   
      },
      {
        path: 'role-assignment',
        component: RoleAssignmentPage,
        canActivate: [ AuthGuard ]   
      },
      {
        path: '',
        redirectTo: '/tabs/dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/dashboard',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
