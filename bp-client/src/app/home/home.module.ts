import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule }   from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HomeRoutingModule} from './home-routing.module';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectComponent } from './components/projects/project/project.component';
import { GroupsComponent } from './components/groups/groups.component';
import { GroupComponent } from './components/groups/group/group.component';
import {SimpleLoaderModule} from '../simple-loader/simple-loader.module';
import {GroupService} from './services/group.service';
import {UserService} from '../services/user.service';
import { AddComponent } from './components/groups/add/add.component';
import { UserGroupsComponent } from './components/groups/user-groups/user-groups.component';
import { AllGroupsComponent } from './components/groups/all-groups/all-groups.component';
import { GroupTaskComponent } from './components/groups/group-task/group-task.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    SimpleLoaderModule
  ],
  declarations: [
    UserProfileComponent,
    ProjectsComponent,
    ProjectComponent,
    GroupsComponent,
    GroupComponent,
    AddComponent,
    UserGroupsComponent,
    AllGroupsComponent,
    GroupTaskComponent
  ],
  providers: [
    GroupService,
    UserService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeModule { }
