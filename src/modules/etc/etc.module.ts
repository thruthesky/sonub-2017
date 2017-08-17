import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { MenuPage } from './pages/menu/menu';
import { PagePage } from './pages/page/page';


const appRoutes: Routes = [
    { path: 'menu', component: MenuPage },
    { path: 'rules', component: PagePage, data: { filename: 'rules', section: 'etc' } },
    { path: 'my-page', component: PagePage, data: { filename: 'my-page', section: 'user' } },
    { path: 'forum', component: PagePage, data: { filename: 'forum-index', section: 'forum' } }
];

@NgModule({
    declarations: [
        MenuPage,
        PagePage
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(appRoutes)
    ]
})
export class EtcModule { }
