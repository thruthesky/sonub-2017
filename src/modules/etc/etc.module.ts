import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { MenuPage } from './pages/menu/menu';
import { PagePage } from './pages/page/page';


const appRoutes: Routes = [
    { path: 'menu', component: MenuPage },
    { path: 'page/:name', component: PagePage },
    { path: 'rules', component: PagePage, data: { filename: 'rules', section: 'etc', layout: 'two-column' } },
    { path: 'my-page', component: PagePage, data: { filename: 'my-page', section: 'user', layout: 'two-column' } },
    { path: 'forum', component: PagePage, data: { filename: 'forum-index', section: 'forum', layout: 'two-column' } },
    { path: 'adv/howto', component: PagePage, data: { filename: 'advertisement-howto', section: 'advertisement', layout: 'wide' } }
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
