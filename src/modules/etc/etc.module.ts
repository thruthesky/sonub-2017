import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { MenuPage } from './pages/menu/menu';
import { RulesPage } from './pages/rules/rules';
import { PagePage } from './pages/page/page';


const appRoutes: Routes = [
    { path: 'menu', component: MenuPage },
    { path: 'rules', component: RulesPage },
    { path: 'my-page', component: PagePage }
];

@NgModule({
    declarations: [
        MenuPage,
        RulesPage,
        PagePage
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(appRoutes)
    ]
})
export class EtcModule { }
