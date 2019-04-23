import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './home.component';
import {AuthGuard} from '../guards/auth.guard';
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {ProjectsComponent} from './components/projects/projects.component';
import {GroupsComponent} from './components/groups/groups.component';
import {ProjectComponent} from './components/projects/project/project.component';
import {GroupComponent} from './components/groups/group/group.component';
import {AddComponent} from './components/groups/add/add.component';
import {UserGroupsComponent} from './components/groups/user-groups/user-groups.component';
import {AllGroupsComponent} from './components/groups/all-groups/all-groups.component';
import {GroupTaskComponent} from './components/groups/group-task/group-task.component';

const homeRoutes: Routes = [
  { path: 'dashboard',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'user/profile',
        component: UserProfileComponent,
        canActivateChild: [AuthGuard]
      },
      {
        path: 'groups',
        component: GroupsComponent,
        children: [
          {
            path: "",
            redirectTo: "user-groups",
            pathMatch: "full"
          },
          {
            path: 'user-groups',
            component: UserGroupsComponent,
            canActivateChild: [AuthGuard]
          },
          {
            path: 'all-groups',
            component: AllGroupsComponent,
            canActivateChild: [AuthGuard]
          },
          {
            path: "add",
            component: AddComponent,
            canActivateChild: [AuthGuard]
          },
          {
            path: ":id",
            component: GroupComponent,
            canActivateChild: [AuthGuard]
          },
          {
            path: ":id/task/:taskID",
            children: [
              {
                path: "",
                component: GroupTaskComponent
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: 'project/:id',
    component: ProjectComponent,
    canActivateChild: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(homeRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class HomeRoutingModule { }
