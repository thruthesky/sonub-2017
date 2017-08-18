import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { WidgetsModule } from './../../widgets/widgets.module';



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


import { AdvertisementCreateEditPage } from './pages/advertisement-create-edit/advertisement-create-edit';
import { AdvertisementListPage } from './pages/advertisement-list/advertisement-list';

import { JobCreateEditPage } from './pages/job-create-edit/job-create-edit';
import { JobListPage } from './pages/job-list/job-list';
import { MyPostsPage } from './pages/my-posts/my-posts';

import { BuyAndSellCreateEditPage } from './pages/buy-and-sell-create-edit/buy-and-sell-create-edit';
import { BuyAndSellListPage } from "./pages/buy-and-sell-list/buy-and-sell-list";
import {BuyAndSellViewContent} from "./modals/buy-and-sell-view/buy-and-sell-view.content";
import {BuyAndSellViewModalService} from "./modals/buy-and-sell-view/buy-and-sell-view.modal";



const appRoutes: Routes = [

    /// my posts
    { path: 'my-posts', component: MyPostsPage },


    /// advertisement
    { path: 'adv/create', component: AdvertisementCreateEditPage },
    { path: 'adv/edit/:id', component: AdvertisementCreateEditPage },
    { path: 'adv/list', component: AdvertisementListPage },

    { path: 'job/create', component: JobCreateEditPage},
    { path: 'job/edit/:id', component: JobCreateEditPage},
    { path: 'job', component: JobListPage},


    { path: 'buyandsell/create', component: BuyAndSellCreateEditPage},
    { path: 'buyandsell/edit/:id', component: BuyAndSellCreateEditPage},
    { path: 'buyandsell', component: BuyAndSellListPage},


    { path: 'view/:id/:title', component: ForumViewPage }, /** /view/:id/-with-title */
    { path: 'view/:id', component: ForumViewPage },

    ///
    { path: 'forum/:slug', component: ForumListPage },
    { path: 'forum/:slug/:action', component: ForumListPage },

];

@NgModule({
    declarations: [
        ForumListPage,
        PostCreateEditContent,
        // CommentCreateComponent,
        // CommentViewComponent,
        CommentEditContent,
        ForumViewPage,
        AdvertisementCreateEditPage,
        AdvertisementListPage,
        JobCreateEditPage,
        JobListPage,
        BuyAndSellCreateEditPage,
        BuyAndSellListPage,
        BuyAndSellViewContent,
        MyPostsPage
    ],
    entryComponents: [
        PostCreateEditContent,
        CommentEditContent,
        BuyAndSellViewContent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(appRoutes),
        NgbModule,
        WidgetsModule
    ],
    providers: [
        PostCreateEditModalService,
        CommentEditModalService,
        ForumCodeShareService,
        BuyAndSellViewModalService
    ]
})
export class ForumModule { }
