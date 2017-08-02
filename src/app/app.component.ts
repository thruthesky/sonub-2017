import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './../providers/app.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    router: Router,
    private app: AppService
  ) {

    document.addEventListener('deviceready', () => this.onDeviceReady(), false);

    // let postID = window['forum_view_post_id'];
    // if ( postID && postID > 0 ) {
    //   router.navigateByUrl('/post/' + postID);
    // }
  }

  onDeviceReady() {
    this.app.push.initCordova();
  }
}
