import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';




import { RegisterPage } from './pages/register/register';
import { LoginPage } from './pages/login/login';
// import { ProfilePage } from './pages/profile/profile';


const appRoutes: Routes = [
    // { path: 'register', component: RegisterPage },
    // { path: 'profile', component: ProfilePage },
    { path: 'login', component: LoginPage },
    { path: 'register', component: RegisterPage },
    { path: '', pathMatch: 'full', component: LoginPage },
    { path: '**', component: LoginPage }
];

@NgModule({
    declarations: [
        RegisterPage,
        LoginPage,
        // ProfilePage
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(appRoutes)
    ]
})
export class UserModule { }
