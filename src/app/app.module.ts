import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';



import { environment } from '../environments/environment'; // environment


//// firebase
import * as firebase from 'firebase';
firebase.initializeApp(environment.firebase);



import { AppComponent } from './app.component';
import { HomeModule, HomePage } from './../pages/home/home.module';


import { WordpressApiService } from './../providers/wordpress-api.service';
import { UserService } from './../providers/user.service';
import { ForumService } from './../providers/forum.service';
import { AppService } from './../providers/app.service';
import { TestService } from './../providers/test.service';



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
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    AppService,
    UserService,
    ForumService,
    WordpressApiService,
    TestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
