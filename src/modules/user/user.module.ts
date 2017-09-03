import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { WidgetsModule } from './../../widgets/widgets.module';



import { RegisterPage } from './pages/register/register';
import { LoginPage } from './pages/login/login';
import { LogoutPage } from './pages/logout/logout';

import { ProfilePage } from './pages/profile/profile';
import { ChangePasswordPage } from './pages/change-password/change-password';

import { SettingsPage } from './pages/settings/settings';
import { OpenProfilePage } from './pages/open-profile/open-profile';
import { ProfileEditPage } from './pages/profile-edit/profile-edit';



const appRoutes: Routes = [
    { path: 'user/profile', component: ProfilePage },
    { path: 'user/profile/edit', component: ProfileEditPage },
    { path: 'user/profile/change-password', component: ChangePasswordPage },
    { path: 'user/login', component: LoginPage },
    { path: 'user/logout', component: LogoutPage },
    { path: 'user/register', component: RegisterPage },
    { path: 'user/settings', component: SettingsPage },
    { path: 'user', component: ProfilePage },
    { path: 'profile/:id', component: OpenProfilePage },
    // { path: '', pathMatch: 'full', component: LoginPage },
    // { path: '**', component: LoginPage }
];

@NgModule({
    declarations: [
        RegisterPage,
        LoginPage,
        ProfilePage,
        ProfileEditPage,
        ChangePasswordPage,
        SettingsPage,
        OpenProfilePage,
        LogoutPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        RouterModule.forChild(appRoutes),
        WidgetsModule
    ]
})
export class UserModule { }
