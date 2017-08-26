import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { WidgetsModule } from './../../widgets/widgets.module';



import { RegisterPage } from './pages/register/register';
import { LoginPage } from './pages/login/login';
import { ProfilePage } from './pages/profile/profile';
import { ProfileEditModalService } from "./pages/modals/profile-edit/profile-edit.modal";
import { ProfileEditContent } from "./pages/modals/profile-edit/profile-edit.content";
import { SettingsPage } from './pages/settings/settings';
import { OpenProfilePage } from './pages/open-profile/open-profile';


const appRoutes: Routes = [
    { path: 'user/profile', component: ProfilePage },
    { path: 'user/login', component: LoginPage },
    { path: 'user/register', component: RegisterPage },
    { path: 'user/settings', component: SettingsPage },
    { path: 'user', component: ProfilePage },
    { path: 'profile/:id', component: OpenProfilePage }
    // { path: '', pathMatch: 'full', component: LoginPage },
    // { path: '**', component: LoginPage }
];

@NgModule({
    declarations: [
        RegisterPage,
        LoginPage,
        ProfilePage,
        ProfileEditContent,
        SettingsPage,
        OpenProfilePage
    ],
    entryComponents: [
        ProfileEditContent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        RouterModule.forChild(appRoutes),
        WidgetsModule
    ],
    providers: [
        ProfileEditModalService
    ]
})
export class UserModule { }
