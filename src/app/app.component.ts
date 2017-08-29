import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { AppService } from './../providers/app.service';
import { HeaderWidget } from './../widgets/header/header';
import {
  POST_LIST, POST,
  PAGE
} from './../providers/wordpress-api/interface';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('headerWidget') headerWidget: HeaderWidget;

  // advSidebar: POST;
  news: PAGE;
  showFooterSticker = true;
  constructor(
    private router: Router,
    public app: AppService
  ) {

    document.addEventListener('deviceready', () => this.onDeviceReady(), false);
    this.app.bootstrap();
    this.app.share.bootstrapLoginLogout();

  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) window.scrollTo(0, 0);
    });
  }

  ngAfterViewInit() {

    this.app.headerWidget = this.headerWidget;
  }



  onDeviceReady() {
    this.app.push.initCordova();
  }




}
