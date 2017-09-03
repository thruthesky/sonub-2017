import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { environment } from '../environments/environment'; // environment

//// firebase
import * as firebase from 'firebase';
firebase.initializeApp(environment.firebase);

/// Ng Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

/// Error Handler
import { CustomErrorHandler } from './app.error-handler';

import { UserModule } from '../modules/user/user.module';
import { ForumModule } from '../modules/forum/forum.module';
import { EtcModule } from '../modules/etc/etc.module';

import { AppComponent } from './app.component';
import { HomeModule, HomePage } from './../modules/home/home.module';
import { AdvertisementModule } from './../modules/advertisement/advertisement.module';


import { WordpressApiService } from './../providers/wordpress-api/wordpress-api.service';
import { UserService } from './../providers/wordpress-api/user.service';
import { ForumService } from './../providers/wordpress-api/forum.service';
import { FileService } from './../providers/wordpress-api/file.service';
import { PageService } from './../providers/wordpress-api/page.service';
import { JobService } from './../providers/wordpress-api/job.service';
import { BuyAndSellService } from '../providers/wordpress-api/buyandsell.service';
import { SearchService } from '../providers/wordpress-api/search.service';

import { ChatService } from './../providers/chat.service';
import { AppService } from './../providers/app.service';
import { TestService } from './../providers/test.service';
import { PageScroll } from './../providers/page-scroll';
import { PushMessageService } from './../providers/push-message';
import { ShareService } from './../providers/share.service';
import { ErrorService } from './../providers/error.service';


import { PhilippineRegion } from "../providers/philippine-region";

import { ModalServiceModule } from '../providers/modals/modal.service.module';
import { WidgetsModule } from './../widgets/widgets.module';




const appRoutes: Routes = [
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
    NgbModule.forRoot(),
    ModalServiceModule,
    UserModule,
    ForumModule,
    EtcModule,
    AdvertisementModule,
    RouterModule.forRoot(appRoutes),
    HttpModule,
    WidgetsModule
  ],
  providers: [
    AppService,
    UserService,
    ForumService,
    FileService,
    JobService,
    PageService,
    BuyAndSellService,
    SearchService,
    WordpressApiService,
    TestService,
    ChatService,
    PageScroll,
    PhilippineRegion,
    PushMessageService,
    ShareService,
    ErrorService,
    { provide: ErrorHandler, useClass: CustomErrorHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


