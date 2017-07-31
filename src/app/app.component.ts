import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    router: Router
  ) {
    // let postID = window['forum_view_post_id'];
    // if ( postID && postID > 0 ) {
    //   router.navigateByUrl('/post/' + postID);
    // }
  }
}
