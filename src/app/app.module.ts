import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';



import { environment } from '../environments/environment'; // environment




//// firebase
import * as firebase from 'firebase';
firebase.initializeApp(environment.firebase);


/// Ng Bootstrap
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


import { CustomErrorHandler } from './app.error-handler';

import { AppComponent } from './app.component';
import { HomeModule, HomePage } from './../pages/home/home.module';


import { WordpressApiService } from './../providers/wordpress-api/wordpress-api.service';
import { UserService } from './../providers/wordpress-api/user.service';
import { ForumService } from './../providers/wordpress-api/forum.service';
import { FileService } from './../providers/wordpress-api/file.service';
import { AppService } from './../providers/app.service';
import { TestService } from './../providers/test.service';
import { PageScroll } from './../providers/page-scroll';



const appRoutes: Routes = [
  { path: 'user', loadChildren: '../pages/user/user.module#UserModule' },
  { path: 'forum', loadChildren: '../pages/forum/forum.module#ForumModule' },
  { path: '', component: HomePage, pathMatch: 'full' },
  { path: '**', component: HomePage }
];


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HomeModule,
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot(),
  ],
  providers: [
    AppService,
    UserService,
    ForumService,
    FileService,
    WordpressApiService,
    TestService,
    PageScroll,
     { provide: ErrorHandler, useClass: CustomErrorHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
