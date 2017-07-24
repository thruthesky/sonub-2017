import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { ForumIndexPage } from './pages/index/index';
import { ForumListPage } from './pages/list/list';
import { PostCreateModalService } from './modals/post-create.modal';
import { PostCreateContent } from './modals/post-create.content'




const appRoutes: Routes = [
    { path: ':slug', component: ForumListPage },
    { path: '', pathMatch: 'full', component: ForumIndexPage },
    { path: '**', component: ForumIndexPage }
];

@NgModule({
    declarations: [
        ForumIndexPage,
        ForumListPage,
        PostCreateContent
    ],
    entryComponents: [
        PostCreateContent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(appRoutes),
        NgbModule
    ],
    providers: [
        PostCreateModalService
    ]
})
export class ForumModule { }
