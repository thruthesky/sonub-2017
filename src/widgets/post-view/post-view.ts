/**
 * Post View Widget is not only used in forum pages but also other pages.
 * So, it is not in forum pages folder.
 * 
 * When you need it, import it in that module and use it.
 */
import { Component, OnInit, Input } from '@angular/core';
import { AppService } from './../../providers/app.service';
import { POST } from './../../providers/wordpress-api/interface';


@Component({
    selector: 'post-view-widget',
    templateUrl: 'post-view.html'
})

export class PostViewWidget implements OnInit {

    @Input() post: POST;
    constructor(
        public app: AppService
    ) {
        // if ( window['forum_view_post_id'] && window['forum_view_post_id'] > 0 ) {
        //     this.post = window['forum_post'];
        // }
        // else {
        //     app.forum.postData( 1 )
        //         .subscribe( post => this.post, e => app.warning(e));
        // }
    }

    ngOnInit() { }
}