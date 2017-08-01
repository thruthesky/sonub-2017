import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WidgetsModule } from './../../widgets/widgets.module';


import { HomePage } from './home';
export { HomePage } from './home';


import { PostViewWidget } from './../../widgets/post-view/post-view';
import { PostLatestWidget } from './../../widgets/post-latest/post-latest';



@NgModule({
    declarations: [
        HomePage
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        WidgetsModule
    ],
    exports: [
    ]
})
export class HomeModule { }
