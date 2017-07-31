/**
 * Post View Component is not only used in forum pages but also other pages.
 * So, it is not in forum pages folder.
 * 
 * When you need it, import it in that module and use it.
 */
import { Component, OnInit } from '@angular/core';
import { AppService } from './../../providers/app.service';
import { POST, POSTS } from './../../providers/wordpress-api/interface';


@Component({
    selector: 'post-latest-widget',
    templateUrl: 'post-latest.html'
})

export class PostLatestWidget implements OnInit {

    posts: POSTS;
    constructor(
        public app: AppService
    ) {
        this.app.forum.postLatest('abc')
            .subscribe( posts => this.posts = posts, e => this.app.warning(e) );
    }

    ngOnInit() { }
}