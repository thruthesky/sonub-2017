import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';




import { ForumIndexPage } from './pages/index/index';


const appRoutes: Routes = [
    { path: 'forum', component: ForumIndexPage },
    { path: '', pathMatch: 'full', component: ForumIndexPage },
    { path: '**', component: ForumIndexPage }
];

@NgModule({
    declarations: [
        ForumIndexPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(appRoutes)
    ]
})
export class ForumModule { }
