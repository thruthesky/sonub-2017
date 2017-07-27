import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { ForumIndexPage } from './pages/index/index';
import { ForumListPage } from './pages/list/list';
import { PostCreateEditModalService } from './modals/post-create-edit/post-create-edit.modal';
import { PostCreateEditContent } from './modals/post-create-edit/post-create-edit.content';
import { CommentCreateComponent } from './components/comment-create/comment-create';


import { FileUploadComponent } from './../../components/file-upload/file-upload'

import { CommentViewComponent } from './components/comment-view/comment-view';

import { CommentEditModalService } from './modals/comment-edit/comment-edit.modal';
import { CommentEditContent } from './modals/comment-edit/comment-edit.content';



const appRoutes: Routes = [
    { path: 'forum/:slug', component: ForumListPage },
    { path: 'forum', component: ForumIndexPage }
];

@NgModule({
    declarations: [
        ForumIndexPage,
        ForumListPage,
        PostCreateEditContent,
        FileUploadComponent,
        CommentCreateComponent,
        CommentViewComponent,
        CommentEditContent
    ],
    entryComponents: [
        PostCreateEditContent,
        CommentEditContent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(appRoutes),
        NgbModule
    ],
    providers: [
        PostCreateEditModalService,
        CommentEditModalService
    ]
})
export class ForumModule { }
