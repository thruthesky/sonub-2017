import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { ForumIndexPage } from './pages/index/index';
import { ForumListPage } from './pages/list/list';
import { PostCreateEditModalService } from './modals/post-create-edit.modal';
import { PostCreateEditContent } from './modals/post-create-edit.content'


import { FileUploadComponent } from './../../components/file-upload/file-upload'


const appRoutes: Routes = [
    { path: ':slug', component: ForumListPage },
    { path: '', pathMatch: 'full', component: ForumIndexPage },
    { path: '**', component: ForumIndexPage }
];

@NgModule({
    declarations: [
        ForumIndexPage,
        ForumListPage,
        PostCreateEditContent,
        FileUploadComponent
    ],
    entryComponents: [
        PostCreateEditContent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(appRoutes),
        NgbModule
    ],
    providers: [
        PostCreateEditModalService
    ]
})
export class ForumModule { }
