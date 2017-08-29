import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { MenuPage } from './pages/menu/menu';
import { PagePage } from './pages/page/page';
import { ChatPage } from './pages/chat/chat';



const appRoutes: Routes = [
    { path: 'menu', component: MenuPage },
    { path: 'page/:filename', component: PagePage },
    { path: 'search/:keyword', component: PagePage, data: { filename: 'search', section: 'search', layout: 'column' }  },
    { path: 'rules', component: PagePage, data: { filename: 'rules', section: 'etc', layout: 'two-column' } },
    { path: 'my-page', component: PagePage, data: { filename: 'my-page', section: 'user', layout: 'two-column' } },
    { path: 'forum', component: PagePage, data: { filename: 'forum-index', section: 'forum', layout: 'two-column' } },
    { path: 'adv/howto', component: PagePage, data: { filename: 'advertisement-howto', section: 'advertisement', layout: 'wide' } },
    { path: 'chat/:id/:name', component: ChatPage },
    { path: 'chat/:id', component: ChatPage },
    { path: 'chat', component: ChatPage }
];

@NgModule({
    declarations: [
        MenuPage,
        PagePage,
        ChatPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(appRoutes)
    ]
})
export class EtcModule { }
