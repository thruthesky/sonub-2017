import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { WidgetsModule } from './../../widgets/widgets.module';


import { ForumIndexPage } from './pages/index/index';
import { ForumListPage } from './pages/list/list';
import { PostCreateEditModalService } from './modals/post-create-edit/post-create-edit.modal';
import { PostCreateEditContent } from './modals/post-create-edit/post-create-edit.content';
// import { CommentCreateComponent } from './components/comment-create/comment-create';
// import { CommentViewComponent } from './components/comment-view/comment-view';

import { CommentEditModalService } from './modals/comment-edit/comment-edit.modal';
import { CommentEditContent } from './modals/comment-edit/comment-edit.content';

import { ForumCodeShareService } from './forum-code-share.service';

import { FileDisplayWidget } from './../../widgets/file-display/file-display';
import { PostViewWidget } from './../../widgets/post-view/post-view';


import { ForumViewPage } from './pages/view/view';

import { AdvertisementHowtoPage } from './pages/advertisement-howto/advertisement-howto';
import { AdvertisementCreateEditPage } from './pages/advertisement-create-edit/advertisement-create-edit';
import { AdvertisementListPage } from './pages/advertisement-list/advertisement-list';

const appRoutes: Routes = [


    /// advertisement
    { path: 'adv/howto', component: AdvertisementHowtoPage },
    { path: 'adv/create', component: AdvertisementCreateEditPage },
    { path: 'adv/edit/:id', component: AdvertisementCreateEditPage },
    { path: 'adv/list', component: AdvertisementListPage },

    { path: 'view/:id/:title', component: ForumViewPage }, /** /view/:id/-with-title */
    { path: 'view/:id', component: ForumViewPage },

    ///
    { path: 'forum/:slug', component: ForumListPage },
    { path: 'forum', component: ForumIndexPage }
];

@NgModule({
    declarations: [
        ForumIndexPage,
        ForumListPage,
        PostCreateEditContent,
        // CommentCreateComponent,
        // CommentViewComponent,
        CommentEditContent,
        ForumViewPage,
        AdvertisementHowtoPage,
        AdvertisementCreateEditPage,
        AdvertisementListPage
    ],
    entryComponents: [
        PostCreateEditContent,
        CommentEditContent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(appRoutes),
        NgbModule,
        WidgetsModule
    ],
    providers: [
        PostCreateEditModalService,
        CommentEditModalService,
        ForumCodeShareService
    ]
})
export class ForumModule { }
