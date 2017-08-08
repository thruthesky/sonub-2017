import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { MenuPage } from './pages/menu/menu';


const appRoutes: Routes = [
    { path: 'menu', component: MenuPage }
];

@NgModule({
    declarations: [
        MenuPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(appRoutes)
    ]
})
export class EtcModule { }
