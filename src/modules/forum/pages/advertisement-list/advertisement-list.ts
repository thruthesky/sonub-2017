import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService, POSTS } from '../../../../providers/app.service';

@Component({
    selector: 'advertisement-list-page',
    templateUrl: 'advertisement-list.html'
})

export class AdvertisementListPage implements OnInit, OnDestroy {
    posts: POSTS;
    constructor(
        public app: AppService
    ) {
        app.pageLayout = 'advertisement';
        app.wp.post( {route: 'wordpress.get_my_advertisements', session_id: app.user.sessionId} )
            .subscribe( (posts: POSTS) => {
                console.log("My ads: ", posts);
                this.posts = posts;
            }, e => app.warning(e));
    }

    ngOnInit() { }
    ngOnDestroy() {
        this.app.pageLayout = 'column';
    }
}