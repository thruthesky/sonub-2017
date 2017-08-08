import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


import { FileDisplayWidget } from './file-display/file-display';
import { PostLatestWidget } from './post-latest/post-latest';
import { PostViewWidget } from './post-view/post-view';
import { HeaderWidget } from './header/header';
import { FileUploadWidget } from './file-upload/file-upload';
import { AdvertisementSidebarWdiget } from './advertisement-sidebar/advertisement-sidebar';

import { PostListThumbnailTextWidget } from './post-list-thumbnail-text/post-list-thumbnail-text';
import { PostListFullWidget } from './post-list-full-widget/post-list-full-widget';

import { CommentCreateWidget } from './comment-create/comment-create';
import { CommentViewWidget } from './comment-view/comment-view';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule
    ],
    exports: [
        FileDisplayWidget,
        PostLatestWidget,
        PostViewWidget,
        HeaderWidget,
        FileUploadWidget,
        AdvertisementSidebarWdiget,
        PostListThumbnailTextWidget,
        PostListFullWidget,
        CommentCreateWidget,
        CommentViewWidget
    ],
    declarations: [
        FileDisplayWidget,
        PostLatestWidget,
        PostViewWidget,
        HeaderWidget,
        FileUploadWidget,
        AdvertisementSidebarWdiget,
        PostListThumbnailTextWidget,
        PostListFullWidget,
        CommentCreateWidget,
        CommentViewWidget
    ],
    providers: [],
})
export class WidgetsModule { }
