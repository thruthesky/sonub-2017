import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


import { FileDisplayWidget } from './file-display/file-display';
import { PostLatestWidget } from './post-latest/post-latest';
import { PostViewWidget } from './post-view/post-view';
import { HeaderWidget } from './header/header';


@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    exports: [
        FileDisplayWidget,
        PostLatestWidget,
        PostViewWidget,
        HeaderWidget
    ],
    declarations: [
        FileDisplayWidget,
        PostLatestWidget,
        PostViewWidget,
        HeaderWidget
    ],
    providers: [],
})
export class WidgetsModule { }