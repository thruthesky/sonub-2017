import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { WidgetsModule } from './../../widgets/widgets.module';



import { RegisterPage } from './pages/register/register';
import { LoginPage } from './pages/login/login';
import { ProfilePage } from './pages/profile/profile';


const appRoutes: Routes = [
    { path: 'user', component: ProfilePage },
    { path: 'user/profile', component: ProfilePage },
    { path: 'user/login', component: LoginPage },
    { path: 'user/register', component: RegisterPage },
    // { path: '', pathMatch: 'full', component: LoginPage },
    // { path: '**', component: LoginPage }
];

@NgModule({
    declarations: [
        RegisterPage,
        LoginPage,
        ProfilePage
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
