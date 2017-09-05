import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WidgetsModule } from '../../widgets/widgets.module';


// import { MenuPage } from './pages/menu/menu';
import { PagePage } from './pages/page/page';
import { ChatPage } from './pages/chat/chat';
import { ChatUnreadPage } from './pages/chat-unread/chat-unread';



/**
 * layout can be 'wide', 'column', 'two-column'
 */
const appRoutes: Routes = [
    // { path: 'menu', component: MenuPage },
    { path: 'menu', component: PagePage, data: { filename: 'menu', section: 'menu', layout: 'column' }  },
    { path: 'page/:filename', component: PagePage },
    { path: 'search/:keyword', component: PagePage, data: { filename: 'search', section: 'search', layout: 'column' }  },
    { path: 'rules', component: PagePage, data: { filename: 'rules', section: 'etc', layout: 'two-column' } },
    // { path: 'my-page', component: PagePage, data: { filename: 'my-page', section: 'user', layout: 'two-column' } },
    { path: 'forum', component: PagePage, data: { filename: 'forum-index', section: 'forum', layout: 'two-column' } },
   
    { path: 'chat/:id/:name', component: ChatPage },
    { path: 'chat/unread', component: ChatUnreadPage },
    { path: 'chat/:id', component: ChatPage },
    { path: 'chat', component: ChatPage }
];

@NgModule({
    declarations: [
        // MenuPage,
        PagePage,
        ChatPage,
        ChatUnreadPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(appRoutes),
        WidgetsModule
    ]
})
export class EtcModule { }
