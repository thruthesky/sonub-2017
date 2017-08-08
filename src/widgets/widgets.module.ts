import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


import { FileDisplayWidget } from './file-display/file-display';
import { PostLatestWidget } from './post-latest/post-latest';
import { PostViewWidget } from './post-view/post-view';
import { HeaderWidget } from './header/header';
import { FileUploadWidget } from './file-upload/file-upload';
import { AdvertisementSidebarWdiget } from './advertisement-sidebar/advertisement-sidebar';



@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    exports: [
        FileDisplayWidget,
        PostLatestWidget,
        PostViewWidget,
        HeaderWidget,
        FileUploadWidget,
        AdvertisementSidebarWdiget
    ],
    declarations: [
        FileDisplayWidget,
        PostLatestWidget,
        PostViewWidget,
        HeaderWidget,
        FileUploadWidget,
        AdvertisementSidebarWdiget
    ],
    providers: [],
})
export class WidgetsModule { }
