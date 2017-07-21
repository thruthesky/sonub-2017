import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeModule, HomePage } from './../pages/home/home.module';


import { WordpressApiService } from './../providers/wordpress-api';


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
  providers: [WordpressApiService],
  bootstrap: [AppComponent]
})
export class AppModule {}
