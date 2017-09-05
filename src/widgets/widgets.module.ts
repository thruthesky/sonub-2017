import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NgbDropdownModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';


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

import { PostHeaderWidget } from './post-header/post-header';
import { ActivityWidget } from './activity/activity';
import { CopyrightWidget } from './copyright/copyright';
import { UserLoginLogoutWidget } from './user-login-logout/user-login-logout';
import { SidebarForumMenuWidget } from './sidebar-forum-menu/sidebar-forum-menu';
// import { AdvertisementMyListSidebarWidget } from './advertisement-my-list-sidebar/advertisement-my-list-sidebar';
import { CommunityLogWidget } from './community-log/community-log';
import { SitePreviewWidget } from './site-preview/site-preview';

import { RecentPopularPostsWidget } from './recent-popular-posts/recent-popular-posts';

import { LoadingWidget } from './loading/loading';
import { NoMoreWidget } from './no-more/no-more';



@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        NgbDropdownModule,
        NgbPopoverModule
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
        CommentViewWidget,
        PostHeaderWidget,
        ActivityWidget,
        CopyrightWidget,
        UserLoginLogoutWidget,
        SidebarForumMenuWidget,
        // AdvertisementMyListSidebarWidget,
        CommunityLogWidget,
        SitePreviewWidget,
        RecentPopularPostsWidget,
        LoadingWidget,
        NoMoreWidget
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
        CommentViewWidget,
        PostHeaderWidget,
        ActivityWidget,
        CopyrightWidget,
        UserLoginLogoutWidget,
        SidebarForumMenuWidget,
        // AdvertisementMyListSidebarWidget,
        CommunityLogWidget,
        SitePreviewWidget,
        RecentPopularPostsWidget,
        LoadingWidget,
        NoMoreWidget
    ],
    providers: [],
})
export class WidgetsModule { }
