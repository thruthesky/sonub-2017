import { Component, OnInit } from '@angular/core';
import { AppService } from './../../providers/app.service';

interface RECENT_POST {
    ID: number;
    post_title: string;
    comment_count: number;
    author: {
        name: string;
        photoURL: string;
    }
};
type RECENT_POSTS = Array<RECENT_POST>;

@Component({
    selector: 'recent-popular-posts',
    templateUrl: 'recent-popular-posts.html'
})

export class RecentPopularPostsWidget implements OnInit {


    posts: RECENT_POSTS = [];
    constructor(
        public app: AppService
    ) {
        app.wp.post({route: 'wordpress.recent_posts_by_comment'}).subscribe( (res: RECENT_POSTS ) => {
            // console.log("popular:", res);
            this.posts = res;
        }, e => app.warning(e));
    }

    ngOnInit() { }
}