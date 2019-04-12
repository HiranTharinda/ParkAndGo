import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { VerificationGuard } from './verification.guard';
import { LoggedInGuard } from './loggedin.guard';

// all routes for ionic
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule', canActivate: [AuthGuard, VerificationGuard] },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule', canActivate: [LoggedInGuard] },
  { path: 'signup', loadChildren: './signup/signup.module#SignupPageModule' },
  { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' },
  { path: 'help', loadChildren: './editprofile/editprofile.module#EditprofilePageModule' },
  { path: 'waiting-verification', loadChildren: './waiting-verification/waiting-verification.module#WaitingVerificationPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
