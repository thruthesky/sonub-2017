import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './../providers/app.service';
import { HeaderWidget } from './../widgets/header/header';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('headerWidget') headerWidget: HeaderWidget;
  constructor(
    router: Router,
    public app: AppService
  ) {

    document.addEventListener('deviceready', () => this.onDeviceReady(), false);

    
  }

  ngAfterViewInit() {

    this.app.headerWidget = this.headerWidget;
  }

  

  onDeviceReady() {
    this.app.push.initCordova();
  }
}
