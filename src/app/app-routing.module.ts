import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AdminShowUserListComponent} from './components/admin/admin-show-user-list.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {UserComponent} from './components/user/displayUser/user.component';
import {HomeComponent} from './components/home/home.component';
import {NoHaveAccessAnnoucementComponent} from './components/no-have-access-annoucement/no-have-access-annoucement.component';
import {CanActivateTeam} from './auth-guard/can-activate-team';
import {IsAdmin} from './auth-guard/is-admin';
import {ProfileComponent} from "./components/user/editUser/profile.component";
import {CreateDiaryComponent} from "./components/diary/create-diary/create-diary.component";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'no-access', component: NoHaveAccessAnnoucementComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'journals', component: UserComponent, canActivate: [CanActivateTeam]}, // để show trang user
  {// phục vụ chức năng admin
    path: 'admin/userList',
    component: AdminShowUserListComponent,
    canActivate: [CanActivateTeam, IsAdmin]
  },
  {path: 'admin/user/:id', component: AdminShowUserListComponent}, // phục vụ chức năng admin
  {path: 'admin/user/block/:id', component: AdminShowUserListComponent}, // phục vụ chức năng admin
  {path: 'app/account', component: ProfileComponent, canActivate: [CanActivateTeam]},
  {path: 'journals/new', component: CreateDiaryComponent, canActivate: [CanActivateTeam]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
